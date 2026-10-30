import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ApbdRingkasan, ProgramDesa } from "@/app/components/apbd-section";

// Helper konversi URL gambar ke base64 (client-side)
async function loadImageAsBase64(url: string): Promise<string | null> {
  if (typeof window === "undefined") return null;
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
      img.src = url;
    } catch {
      resolve(null);
    }
  });
}

export async function exportApbdesToPdf(
  ringkasan: ApbdRingkasan,
  daftarProgram: ProgramDesa[]
): Promise<void> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const leftMargin = 14;
  const rightMargin = pageWidth - 14;
  const contentWidth = rightMargin - leftMargin;

  // 1. KOP SURAT RESMI DESA
  const logoBase64 = await loadImageAsBase64("/Logo/Seal_of_Sidoarjo_Regency.svg.png");
  if (logoBase64) {
    try {
      doc.addImage(logoBase64, "PNG", leftMargin + 2, 11, 19, 23);
    } catch {
      // Lewati jika terjadi kegagalan format gambar
    }
  }

  // Teks Kop Surat
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(40, 40, 40);
  doc.text("PEMERINTAH KABUPATEN SIDOARJO", pageWidth / 2, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(20, 20, 20);
  doc.text("KECAMATAN GEDANGAN", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(15);
  doc.setTextColor(6, 78, 59); // Emerald gelap (#064E3B)
  doc.text("PEMERINTAH DESA SAWOTRATAP", pageWidth / 2, 26, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(70, 70, 70);
  doc.text(
    "Alamat: Jl. Sawotratap No. 01, Kec. Gedangan, Kab. Sidoarjo, Jawa Timur 61254",
    pageWidth / 2,
    30.5,
    { align: "center" }
  );
  doc.setFontSize(7.5);
  doc.setTextColor(100, 100, 100);
  doc.text(
    "Laman Resmi: sawotratap.desa.id | Email: pemdes@sawotratap.desa.id | Telp: (031) 8910-123",
    pageWidth / 2,
    34.5,
    { align: "center" }
  );

  // Garis Ganda Kop Surat
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(1.1);
  doc.line(leftMargin, 38, rightMargin, 38);

  doc.setLineWidth(0.3);
  doc.line(leftMargin, 39.2, rightMargin, 39.2);

  // 2. JUDUL DOKUMEN & NOMOR RESMI
  let currentY = 46;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(17, 24, 39);
  doc.text(
    "LAPORAN REALISASI ANGGARAN PENDAPATAN DAN BELANJA DESA (APBDes)",
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 5;
  doc.setFontSize(10.5);
  doc.setTextColor(6, 78, 59);
  doc.text(
    `TAHUN ANGGARAN ${ringkasan.tahun || "2026"}`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  currentY += 4.5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Nomor Publikasi: 140/APBDes-SWT/Publik/${ringkasan.tahun || "2026"} • Status: Terverifikasi BPD & Inspektorat`,
    pageWidth / 2,
    currentY,
    { align: "center" }
  );

  // 3. KARTU RINGKASAN ANGGARAN
  currentY += 6;
  doc.setFillColor(248, 250, 248); // Abu-abu kehijauan lembut
  doc.setDrawColor(227, 232, 226);
  doc.setLineWidth(0.3);
  doc.roundedRect(leftMargin, currentY, contentWidth, 23, 2, 2, "FD");

  const colWidth = contentWidth / 4;
  const metrics = [
    { label: "TOTAL PAGU APBDES", val: ringkasan.total_pagu || "Rp 2.450.000.000", color: [17, 24, 39] },
    { label: "REALISASI BELANJA", val: ringkasan.realisasi_dana || "Rp 1.820.000.000", color: [6, 78, 59] },
    { label: "SERAPAN ANGGARAN", val: `${ringkasan.persen_penyerapan || "74.3%"}`, color: [14, 116, 144] },
    { label: "SURPLUS / SISA KAS", val: ringkasan.surplus_kas || "Rp 630.000.000", color: [13, 148, 136] },
  ];

  metrics.forEach((m, idx) => {
    const startX = leftMargin + idx * colWidth;
    
    // Separator line antar metrik
    if (idx > 0) {
      doc.setDrawColor(227, 232, 226);
      doc.setLineWidth(0.2);
      doc.line(startX, currentY + 3, startX, currentY + 20);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, startX + colWidth / 2, currentY + 6.5, { align: "center" });

    doc.setFontSize(10.5);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.val, startX + colWidth / 2, currentY + 13.5, { align: "center" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(120, 120, 120);
    const subtext =
      idx === 0
        ? "Dana Desa + PADes"
        : idx === 1
        ? "Pembangunan & Operasional"
        : idx === 2
        ? "Target Tercapai Baik"
        : "Cadangan Kas Desa";
    doc.text(subtext, startX + colWidth / 2, currentY + 18.5, { align: "center" });
  });

  // Keterangan Alokasi Fisik
  currentY += 27;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(17, 24, 39);
  doc.text("RINCIAN PROGRAM & KEGIATAN DESA SAWOTRATAP", leftMargin, currentY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Alokasi Fisik Terencana: ${ringkasan.alokasi_fisik || "Rp 1.150.000.000"} • Total Kegiatan: ${daftarProgram.length} Program`,
    rightMargin,
    currentY,
    { align: "right" }
  );

  // 4. TABEL RINCIAN PROGRAM KEGIATAN (AUTOTABLE)
  const tableData = daftarProgram.map((prog, index) => [
    index + 1,
    prog.nama + (prog.keterangan ? `\n${prog.keterangan}` : ""),
    prog.kategori || "-",
    prog.anggaran || "-",
    prog.lokasi || "Desa Sawotratap",
    `${prog.progres || 0}%`,
    prog.status === "selesai" ? "Selesai" : "Proses",
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    margin: { left: leftMargin, right: 14, bottom: 25 },
    head: [["No", "Nama Program & Uraian Kegiatan", "Kategori", "Anggaran", "Lokasi", "Progres", "Status"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [6, 78, 59], // #064E3B
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 7.5,
      halign: "center",
      valign: "middle",
      cellPadding: 2.2,
    },
    bodyStyles: {
      fontSize: 7,
      textColor: [30, 41, 59],
      cellPadding: 2,
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 248],
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 62, halign: "left" },
      2: { cellWidth: 24, halign: "center" },
      3: { cellWidth: 26, halign: "right", fontStyle: "bold" },
      4: { cellWidth: 26, halign: "left" },
      5: { cellWidth: 16, halign: "center" },
      6: { cellWidth: 20, halign: "center", fontStyle: "bold" },
    },
    didParseCell: (data) => {
      // Pewarnaan status
      if (data.section === "body" && data.column.index === 6) {
        if (data.cell.raw === "Selesai") {
          data.cell.styles.textColor = [5, 150, 105]; // Hijau
        } else {
          data.cell.styles.textColor = [217, 119, 6]; // Amber / Orange
        }
      }
    },
  });

  // 5. AREA PENGESAHAN / TANDA TANGAN DI BAGIAN BAWAH
  // @ts-expect-error jsPDF autotable attaches lastAutoTable to doc
  let finalY = doc.lastAutoTable.finalY + 8;

  // Jika tidak cukup ruang untuk tanda tangan di halaman terakhir (butuh ~35mm), buat halaman baru
  if (finalY > pageHeight - 40) {
    doc.addPage();
    finalY = 20;
  }

  const tanggalSekarang = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const ttdLeftCol = leftMargin + 10;
  const ttdRightCol = rightMargin - 60;

  // TTD Kiri (Sekretaris Desa)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text("Mengetahui,", ttdLeftCol + 20, finalY, { align: "center" });
  doc.text("Sekretaris Desa Sawotratap", ttdLeftCol + 20, finalY + 4, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("M. RIDWAN, S.AP", ttdLeftCol + 20, finalY + 23, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("NIPD. 19820412 201101 1 004", ttdLeftCol + 20, finalY + 26.5, { align: "center" });

  // TTD Kanan (Kepala Desa)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(50, 50, 50);
  doc.text(`Sawotratap, ${tanggalSekarang}`, ttdRightCol + 20, finalY, { align: "center" });
  doc.text("Kepala Desa Sawotratap", ttdRightCol + 20, finalY + 4, { align: "center" });

  // Stempel Digital Box
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.4);
  doc.roundedRect(ttdRightCol + 4, finalY + 7.5, 32, 10, 1.5, 1.5, "D");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(6, 78, 59);
  doc.text("TERVERIFIKASI DIGITAL", ttdRightCol + 20, finalY + 11.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.text("PEMDES SAWOTRATAP", ttdRightCol + 20, finalY + 15, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(17, 24, 39);
  doc.text("H. BAMBANG WIDODO, S.E.", ttdRightCol + 20, finalY + 23, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text("Kepala Desa Sawotratap", ttdRightCol + 20, finalY + 26.5, { align: "center" });

  // 6. FOOTER HALAMAN & WATERMARK RESMI DI SETIAP HALAMAN
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setDrawColor(227, 232, 226);
    doc.setLineWidth(0.2);
    doc.line(leftMargin, pageHeight - 12, rightMargin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(140, 140, 140);
    doc.text(
      "Dokumen resmi keterbukaan publik Pemerintah Desa Sawotratap • Dicetak otomatis melalui Portal sawotratap.desa.id",
      leftMargin,
      pageHeight - 8
    );
    doc.text(`Halaman ${i} dari ${totalPages}`, rightMargin, pageHeight - 8, { align: "right" });
  }

  // 7. SIMPAN / UNDUH FILE PDF SECARA OTOMATIS
  const namaFile = `Laporan_Resmi_APBDes_Sawotratap_${ringkasan.tahun || "2026"}.pdf`;
  doc.save(namaFile);
}
