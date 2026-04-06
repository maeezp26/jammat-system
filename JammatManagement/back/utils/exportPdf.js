const PDFDocument = require("pdfkit");

function generatePDF(jammats, res, year) {

  const doc = new PDFDocument({
    margin: 40,
    size: "A4"
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=jammat_report_${year}.pdf`
  );

  doc.pipe(res);

  // ===== Title =====
  doc
    .fontSize(22)
    .fillColor("#1e3a8a")
    .text(`${year} Jammat Report`, { align: "center" });

  doc.moveDown(2);

  jammats.forEach((j, index) => {

    const start = new Date(j.startDate).toLocaleDateString();
    const end = new Date(j.endDate).toLocaleDateString();

    // ===== Card Background =====
    const cardTop = doc.y;

    doc
      .rect(40, cardTop - 5, 520, 20)
      .fill("#2563eb");

    doc
      .fillColor("white")
      .fontSize(14)
      .text(`Jammat ${j.jammatNo || index + 1}`, 45, cardTop);

    doc.moveDown(1.5);

    doc.fillColor("black");

    // ===== Grid Section =====

    const leftX = 45;
    const rightX = 300;

    doc.fontSize(11);

    doc.text(`Type:`, leftX);
    doc.text(`${j.type}`, leftX, doc.y);

    doc.text(`Masjid:`, rightX, cardTop + 25);
    doc.text(`${j.masjidName}`, rightX);

    doc.text(`Ameer:`, leftX, doc.y + 5);
    doc.text(`${j.ameer || "-"}`, leftX);

    doc.text(`Saathi:`, rightX, doc.y - 12);
    doc.text(`${j.saathi || "-"}`, rightX);

    doc.text(`Dates:`, leftX, doc.y + 10);
    doc.text(`${start} - ${end}`, leftX);

    doc.moveDown(1);

    // ===== Route =====
    if (j.route?.length) {

      doc
        .font("Helvetica-Bold")
        .text("Route", leftX);

      doc.font("Helvetica");

      j.route.forEach(r => {
        doc.text(`• ${r}`, leftX + 10);
      });

      doc.moveDown(1);
    }

    // ===== Members =====

    doc
      .font("Helvetica-Bold")
      .text("Members", leftX);

    doc.font("Helvetica");

    j.members.forEach(group => {

      doc
        .fillColor("#1d4ed8")
        .text(group.masjid, leftX + 5);

      doc.fillColor("black");

      const col1 = leftX + 20;
      const col2 = 300;

      let toggle = true;

      group.names.forEach(name => {

        if (toggle) {
          doc.text(`• ${name}`, col1);
        } else {
          doc.text(`• ${name}`, col2, doc.y - 12);
        }

        toggle = !toggle;

      });

      doc.moveDown(1);

    });

    doc.moveDown(2);

    // Divider
    doc
      .moveTo(40, doc.y)
      .lineTo(560, doc.y)
      .strokeColor("#e5e7eb")
      .stroke();

    doc.moveDown(2);

  });

  doc.end();
}

module.exports = generatePDF;