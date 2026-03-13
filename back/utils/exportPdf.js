const PDFDocument = require("pdfkit");

const generatePDF = (jammats, res, year) => {

  const doc = new PDFDocument({ margin: 30 });

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=jammat-report-${year}.pdf`
  );

  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text(`Jammat Report - ${year}`, { align: "center" });

  doc.moveDown();

  jammats.forEach((j, index) => {

    doc
      .fontSize(12)
      .text(
        `${index + 1}. ${j.month} | Jammat ${j.jammatNo} | ${j.type} | ${j.category}`
      );

    doc.text(`Masjid: ${j.masjidName}`);

    doc.text(`Route: ${j.route.join(" → ")}`);

    doc.text(
      `Date: ${new Date(j.startDate).toDateString()} - ${new Date(
        j.endDate
      ).toDateString()}`
    );

    doc.text(`Saathi: ${j.saathi}`);

    if (j.note) {
      doc.text(`Note: ${j.note}`);
    }

    doc.moveDown();
  });

  doc.end();
};

module.exports = generatePDF;