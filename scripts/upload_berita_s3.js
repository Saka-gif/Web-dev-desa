const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.S3_REGION || 'us-east-1',
  endpoint: process.env.S3_ENDPOINT || 'https://s3-id-jkt-1.kilatstorage.id',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const BUCKET = 'sawotratap-image';

const filesToUpload = [
  { local: 'public/aset/gotong-royong.jpg', s3Key: 'berita/gotong-royong.jpg' },
  { local: 'public/aset/pelayanan.jpg', s3Key: 'berita/pelayanan.jpg' },
  { local: 'public/aset/umkm-desa.jpg', s3Key: 'berita/umkm-desa.jpg' },
  { local: 'public/aset/balai-desa.jpg', s3Key: 'berita/balai-desa.jpg' },
  { local: 'public/aset/pedesaan.jpg', s3Key: 'berita/pedesaan.jpg' },
];

async function uploadFiles() {
  console.log('Uploading berita images to CloudKilat S3 bucket:', BUCKET);
  const uploadedUrls = {};

  for (const item of filesToUpload) {
    const fullPath = path.resolve(item.local);
    if (!fs.existsSync(fullPath)) {
      console.warn('File not found:', fullPath);
      continue;
    }

    const fileContent = fs.readFileSync(fullPath);
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: item.s3Key,
      Body: fileContent,
      ContentType: 'image/jpeg',
      ACL: 'public-read',
    });

    try {
      await s3.send(command);
      const publicUrl = `https://s3-id-jkt-1.kilatstorage.id/${BUCKET}/${item.s3Key}`;
      console.log(`✅ Uploaded: ${item.s3Key} -> ${publicUrl}`);
      uploadedUrls[item.local] = publicUrl;
    } catch (err) {
      console.error(`❌ Failed to upload ${item.s3Key}:`, err.message);
    }
  }

  console.log('\nUpload summary:', JSON.stringify(uploadedUrls, null, 2));
}

uploadFiles();
