const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { createClient } = require('@supabase/supabase-js');

// 1. Baca env credentials
const envPath = path.resolve('.env.local');
const env = fs.readFileSync(envPath, 'utf8');

function getEnv(key) {
  const m = env.match(new RegExp(`${key}\\s*=\\s*(.*)`));
  return m ? m[1].trim().replace(/^['"]|['"]$/g, '') : '';
}

const s3Endpoint = getEnv('S3_ENDPOINT') || 'https://s3-id-jkt-1.kilatstorage.id';
const s3Region = getEnv('S3_REGION') || 'us-east-1';
const s3Bucket = getEnv('S3_BUCKET') || 'sawotratap-image';
const s3AccessKeyId = getEnv('S3_ACCESS_KEY_ID');
const s3SecretAccessKey = getEnv('S3_SECRET_ACCESS_KEY');

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

const s3 = new S3Client({
  region: s3Region,
  endpoint: s3Endpoint,
  credentials: {
    accessKeyId: s3AccessKeyId,
    secretAccessKey: s3SecretAccessKey,
  },
  forcePathStyle: true,
});

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const folderSource = path.resolve('fotoumkmyangbenar');

const mapping = [
  {
    fileName: 'Batik Tulis & Cap Corak Khas Delta Sawotratap.jpg',
    targetId: 'umkm-4',
    s3Key: 'umkm/batik-tulis-delta-sawotratap.jpg',
    contentType: 'image/jpeg',
  },
  {
    fileName: 'Keripik Tempe Renyah.jpeg',
    targetId: 'umkm-340196-4595',
    s3Key: 'umkm/keripik-tempe-renyah.jpeg',
    contentType: 'image/jpeg',
  },
  {
    fileName: 'Kerupuk Puli & Kupang Khas Sidoarjo Delta.jpg',
    targetId: 'umkm-2',
    s3Key: 'umkm/kerupuk-puli-kupang.jpg',
    contentType: 'image/jpeg',
  },
  {
    fileName: 'Konveksi Sablon Kaos & Bordir Komunitas.jpg',
    targetId: 'umkm-6',
    s3Key: 'umkm/konveksi-sablon-kaos.jpg',
    contentType: 'image/jpeg',
  },
  {
    fileName: 'Kue Basah & Jajanan Tradisional.webp',
    targetId: 'umkm-1',
    s3Key: 'umkm/kue-basah-tradisional.webp',
    contentType: 'image/webp',
  },
  {
    fileName: 'Sambal Bandeng Asap & Olahan Ikan Segar.jpg',
    targetId: 'umkm-5',
    s3Key: 'umkm/sambal-bandeng-asap.jpg',
    contentType: 'image/jpeg',
  },
];

async function run() {
  console.log('🚀 Memulai upload foto UMKM yang benar ke S3 KilatStorage...');
  const uploadedUrls = {};

  for (const item of mapping) {
    const filePath = path.join(folderSource, item.fileName);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ File tidak ditemukan: ${filePath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(filePath);
    const command = new PutObjectCommand({
      Bucket: s3Bucket,
      Key: item.s3Key,
      Body: fileBuffer,
      ContentType: item.contentType,
      ACL: 'public-read',
    });

    try {
      await s3.send(command);
      const publicUrl = `${s3Endpoint}/${s3Bucket}/${item.s3Key}`;
      uploadedUrls[item.targetId] = publicUrl;
      console.log(`✅ S3 Upload Sukses [${item.targetId}]: ${publicUrl}`);
    } catch (err) {
      console.error(`❌ Gagal upload S3 ${item.fileName}:`, err.message);
    }
  }

  console.log('\n🔄 Memperbarui Database Supabase tabel "umkm"...');
  for (const [id, url] of Object.entries(uploadedUrls)) {
    const { error } = await supabase
      .from('umkm')
      .update({
        foto: url,
        foto_gallery: [url],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error(`❌ Supabase update error untuk ${id}:`, error);
    } else {
      console.log(`✅ Supabase updated: ${id} -> ${url}`);
    }
  }

  console.log('\n🔄 Memperbarui app/data/umkm_store.json...');
  const storePath = path.resolve('app/data/umkm_store.json');
  if (fs.existsSync(storePath)) {
    const store = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    let modified = false;
    for (const record of store) {
      if (uploadedUrls[record.id]) {
        record.foto = uploadedUrls[record.id];
        record.foto_gallery = [uploadedUrls[record.id]];
        record.updated_at = new Date().toISOString();
        modified = true;
      }
    }
    if (modified) {
      fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf8');
      console.log('✅ umkm_store.json berhasil diperbarui!');
    }
  }

  console.log('\n🔄 Memperbarui app/data/umkm.ts...');
  const umkmTsPath = path.resolve('app/data/umkm.ts');
  if (fs.existsSync(umkmTsPath)) {
    let content = fs.readFileSync(umkmTsPath, 'utf8');
    for (const [id, url] of Object.entries(uploadedUrls)) {
      // Regex replace foto untuk ID spesifik
      const regex = new RegExp(`(id:\\s*["']${id}["'][\\s\\S]*?foto:\\s*["'])[^"']+(["'])`);
      if (regex.test(content)) {
        content = content.replace(regex, `$1${url}$2`);
        console.log(`✅ umkm.ts foto updated untuk ${id}`);
      }
    }
    fs.writeFileSync(umkmTsPath, content, 'utf8');
  }

  // Hapus folder fotoumkmyangbenar sesuai instruksi
  console.log('\n🗑️ Menghapus folder fotoumkmyangbenar...');
  try {
    fs.rmSync(folderSource, { recursive: true, force: true });
    console.log('✅ Folder fotoumkmyangbenar berhasil dihapus!');
  } catch (err) {
    console.error('❌ Gagal menghapus folder:', err.message);
  }

  console.log('\n✨ Semua proses selesai dengan sukses!');
}

run();
