// generate-pdf-controller.js
const Faculty = require("../models/faculty");
const Subject = require("../models/subjects");
const Payment = require("../models/payment");
const PDFDocument = require("pdfkit");
const moment = require("moment");
const path = require("path");
const { toWords } = require("number-to-words");

// URL : GET /payment/generate-pdf/:paymentId
exports.getPDF = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("facultyId")
      .populate("subjectBreakdown.subjectId");

    if (!payment) return res.status(404).send("Payment not found");
    // ❌ Block slip generation if not paid
    if (payment.status !== "paid") {
      return res.status(400).json({
        message: "Slip can only be generated after payment is successful",
      });
    }
    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const safeName = payment.facultyId.name.replace(/\s+/g, "_");
    const fileName = `Slip_${safeName}_${payment.semesterType}_${payment.academicYear}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    doc.pipe(res);

    // =============================
    // 💠 HEADER
    // =============================
    const logoPath = path.join(__dirname, "../public/logo.jpg");
    doc
      .rect(40, 25, 530, 90)
      .fillAndStroke("#f5f7fa", "#2c3e50")
      .fillColor("black");

    doc.image(logoPath, 55, 35, { width: 60, align: "left" });

    doc
      .fontSize(20)
      .fillColor("#2c3e50")
      .font("Helvetica-Bold")
      .text("RIZVI EDUCATION SOCIETY", 0, 40, { align: "center" })
      .fontSize(15)
      .text("Rizvi College of Engineering", { align: "center" })
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#34495e")
      .text("Approved by AICTE | Affiliated to University of Mumbai", {
        align: "center",
      })
      .text("Off Carter Road, Bandra (W), Mumbai - 400050", {
        align: "center",
      });

    doc
      .moveTo(40, 120)
      .lineTo(570, 120)
      .lineWidth(2)
      .strokeColor("#2c3e50")
      .stroke();

    // =============================
    // 🎓 Faculty Details
    // =============================
    doc.moveDown(1.5).fontSize(11);
    const leftX = 50;
    const rightX = 320;
    const spacing = 20;
    let y = 130;

    doc
      .rect(40, y - 8, 530, 90)
      .fillAndStroke("#eaf6fb", "#b2bec3")
      .fillColor("black");

    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Faculty Name:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.facultyId.name, leftX + 110, y);
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Semester Type:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.semesterType, rightX + 120, y);

    y += spacing;
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Department:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.facultyId.department, leftX + 110, y);
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Academic Year:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.academicYear, rightX + 120, y);

    y += spacing;
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Designation:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.facultyId.designation || "Faculty", leftX + 110, y);
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Payment Date:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(moment(payment.paidAt).format("DD-MM-YYYY"), rightX + 120, y);
      // .text(moment().format("DD-MM-YYYY"), rightX + 120, y);

    y += spacing;
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Email:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(payment.facultyId.email, leftX + 110, y);

    doc.moveDown(2);
    // =============================
    //   Subject Breakdown Table
    // =============================

    // Push down so it doesn't overlap previous block
    doc.moveDown(2);

    const tableTopY = doc.y;
    const tableLeftX = 50;

    // Define exact column widths (total = 470px wide table)
    const tableColWidths = {
      no: 40,
      subject: 230,
      semester: 100,
      amount: 100,
    };
    const tableWidth =
      tableColWidths.no +
      tableColWidths.subject +
      tableColWidths.semester +
      tableColWidths.amount;

    const tableHeaderBg = "#d1f2eb";
    const tableRowBg = "#f8f9f9";
    const tableBorder = "#b2bec3";

    // ================== 
    //       Header 
    // ==================
    doc
      .rect(tableLeftX, tableTopY, tableWidth, 24)
      .fillAndStroke(tableHeaderBg, tableBorder);

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#117864")
      .text("No.", tableLeftX + 5, tableTopY + 6, {
        width: tableColWidths.no - 10,
        align: "left",
      })
      .text("Subject", tableLeftX + tableColWidths.no + 5, tableTopY + 6, {
        width: tableColWidths.subject - 10,
        align: "left",
      })
      .text(
        "Semester",
        tableLeftX + tableColWidths.no + tableColWidths.subject + 5,
        tableTopY + 6,
        { width: tableColWidths.semester - 10, align: "center" }
      )
      .text(
        "Amount (Rs.)",
        tableLeftX +
          tableColWidths.no +
          tableColWidths.subject +
          tableColWidths.semester +
          5,
        tableTopY + 6,
        { width: tableColWidths.amount - 10, align: "right" }
      );

    let yTable = tableTopY + 24;
    let totalBreakdown = 0;

    // ================= 
    //      Rows  
    // =================
    payment.subjectBreakdown.forEach((entry, index) => {
      const subjectName = `${entry.subjectId.name}\n(${entry.subjectId.department})`;
      const subjectAmount = entry.subjectTotal;
      const subjectSem = entry.semester;
      totalBreakdown += subjectAmount;

      // Measure wrapped subject text height
      const subjectHeight = doc.heightOfString(subjectName, {
        width: tableColWidths.subject - 10,
        align: "left",
      });
      const rowHeight = Math.max(22, subjectHeight + 10);

      // Row background
      if (index % 2 === 0) {
        doc
          .rect(tableLeftX, yTable, tableWidth, rowHeight)
          .fillAndStroke(tableRowBg, tableBorder);
      } else {
        doc
          .rect(tableLeftX, yTable, tableWidth, rowHeight)
          .strokeColor(tableBorder)
          .stroke();
      }

      // Row text
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("black")
        .text(index + 1, tableLeftX + 5, yTable + 6, {
          width: tableColWidths.no - 10,
          align: "left",
        })
        .text(subjectName, tableLeftX + tableColWidths.no + 5, yTable + 6, {
          width: tableColWidths.subject - 10,
          align: "left",
        })
        .text(
          subjectSem.toString(),
          tableLeftX + tableColWidths.no + tableColWidths.subject + 5,
          yTable + 6,
          { width: tableColWidths.semester - 10, align: "center" }
        )
        .text(
          `Rs. ${subjectAmount.toFixed(2)}`,
          tableLeftX +
            tableColWidths.no +
            tableColWidths.subject +
            tableColWidths.semester +
            5,
          yTable + 6,
          { width: tableColWidths.amount - 10, align: "right" }
        );

      yTable += rowHeight;
    });

    // Draw border around full table
    doc
      .rect(tableLeftX, tableTopY, tableWidth, yTable - tableTopY)
      .lineWidth(1)
      .strokeColor(tableBorder)
      .stroke();

    // Move cursor down for next content (summary block etc.)
    doc.y = yTable + 20;

    // =============================
    //    Salary Breakdown Box 
    // =============================
    const salaryBoxY = doc.y;
    doc
      .rect(50, salaryBoxY, 500, 60)
      .fillAndStroke("#fef9e7", "#f7ca18")
      .fillColor("black");

    doc
      /* .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#b9770e")
      .text("Base Salary:", 60, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Rs. ${payment.baseSalary.toFixed(2)}`, 180, salaryBoxY + 10) */
      .font("Helvetica-Bold")
      .fillColor("#b9770e")
      .text("Travel Allowance:", 60, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Rs. ${payment.travelAllowance.toFixed(2)}`, 180, salaryBoxY + 10)
      .font("Helvetica-Bold")
      .fillColor("#b9770e")
      .text("Duties Total:", 320, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(
        `Rs. ${payment.totalRemuneration.toFixed(2)}`,
        440,
        salaryBoxY + 10
      );

    doc.moveDown(3);

    // =============================
    //          Total Box 
    // =============================
    const boxY = doc.y;
    doc
      .rect(50, boxY, 500, 36)
      .fillAndStroke("#d4efdf", "#229954")
      .fillColor("black");

    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#229954")
      .text("Total :", 60, boxY + 10)
      .font("Helvetica-Bold")
      .fillColor("#145a32")
      .text(`Rs. ${payment.totalAmount.toFixed(2)}`, 400, boxY + 10, {
        width: 130,
        align: "right",
      });

    doc.fillColor("black");

    // =============================
    //       Amount in Words 
    // =============================
    const amountWords = toWords(payment.totalAmount).toUpperCase();
    doc
      .moveDown(2)
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#2e4053")
      .text(`Amount in words:`, 50)
      .font("Helvetica")
      .fillColor("black")
      .text(`${amountWords} ONLY`, 180);

    // ==========================
    //          Footer 
    // ==========================
    doc.moveDown(2);

    // Payment Mode
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#2874a6")
      .text("Payment Mode:", 50, doc.y)
      .font("Helvetica")
      .fillColor("black")
      .text("NEFT/UPI", 150, doc.y - 15);

    // For Principal
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#7d6608")
      .text("For Principal", 0, doc.y - 15, { align: "right" });

    // Note
    doc
      .moveDown(2)
      .fontSize(9)
      .fillColor("#616a6b")
      .text("Note: This is a system-generated slip. Signature not required.", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF.");
  }
};

// When so many Subjects are there and Remuneration is longer and cannot fit in one page then we can use this controller.
/* exports.getPDF = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId)
      .populate("facultyId")
      .populate("subjectBreakdown.subjectId");

    if (!payment) return res.status(404).send("Payment not found");

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    const fileName = `Remuneration_Slip_${payment.facultyId.name}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    doc.pipe(res);

    // =============== HEADER ===============
    const logoPath = path.join(__dirname, "../public/logo.jpg");
    doc.rect(40, 25, 530, 90).fillAndStroke("#f5f7fa", "#2c3e50").fillColor("black");

    doc.image(logoPath, 55, 35, { width: 60, align: "left" });

    doc.fontSize(20).fillColor("#2c3e50").font("Helvetica-Bold")
      .text("RIZVI EDUCATION SOCIETY", 0, 40, { align: "center" })
      .fontSize(15).text("Rizvi College of Engineering", { align: "center" })
      .fontSize(10).font("Helvetica").fillColor("#34495e")
      .text("Approved by AICTE | Affiliated to University of Mumbai", { align: "center" })
      .text("Off Carter Road, Bandra (W), Mumbai - 400050", { align: "center" });

    doc.moveTo(40, 120).lineTo(570, 120).lineWidth(2).strokeColor("#2c3e50").stroke();

    // =============== FACULTY DETAILS ===============
    doc.moveDown(1.5).fontSize(11);
    const leftX = 50, rightX = 320, spacing = 20;
    let y = 130;

    doc.rect(40, y - 8, 530, 90).fillAndStroke("#eaf6fb", "#b2bec3").fillColor("black");

    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Faculty Name:", leftX, y);
    doc.font("Helvetica").fillColor("black").text(payment.facultyId.name, leftX + 110, y);
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Semester Type:", rightX, y);
    doc.font("Helvetica").fillColor("black").text(payment.semesterType, rightX + 120, y);

    y += spacing;
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Department:", leftX, y);
    doc.font("Helvetica").fillColor("black").text(payment.facultyId.department, leftX + 110, y);
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Academic Year:", rightX, y);
    doc.font("Helvetica").fillColor("black").text(payment.academicYear, rightX + 120, y);

    y += spacing;
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Designation:", leftX, y);
    doc.font("Helvetica").fillColor("black").text(payment.facultyId.designation || "Faculty", leftX + 110, y);
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Generated Date:", rightX, y);
    doc.font("Helvetica").fillColor("black").text(moment().format("DD-MM-YYYY"), rightX + 120, y);

    y += spacing;
    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Email:", leftX, y);
    doc.font("Helvetica").fillColor("black").text(payment.facultyId.email, leftX + 110, y);

    doc.moveDown(2);

    // =============== SUBJECT BREAKDOWN TABLE ===============
    const drawTableHeader = (yPos) => {
      const tableLeftX = 50;
      const colWidths = { no: 40, subject: 230, semester: 100, amount: 100 };
      const tableWidth = colWidths.no + colWidths.subject + colWidths.semester + colWidths.amount;

      doc.rect(tableLeftX, yPos, tableWidth, 24).fillAndStroke("#d1f2eb", "#b2bec3");
      doc.font("Helvetica-Bold").fontSize(12).fillColor("#117864")
        .text("No.", tableLeftX + 5, yPos + 6, { width: colWidths.no - 10, align: "left" })
        .text("Subject", tableLeftX + colWidths.no + 5, yPos + 6, { width: colWidths.subject - 10, align: "left" })
        .text("Semester", tableLeftX + colWidths.no + colWidths.subject + 5, yPos + 6, { width: colWidths.semester - 10, align: "center" })
        .text("Amount (Rs.)", tableLeftX + colWidths.no + colWidths.subject + colWidths.semester + 5, yPos + 6, { width: colWidths.amount - 10, align: "right" });

      return { tableLeftX, colWidths, tableWidth };
    };

    let { tableLeftX, colWidths, tableWidth } = drawTableHeader(doc.y);
    let yTable = doc.y + 24;
    let totalBreakdown = 0;

    payment.subjectBreakdown.forEach((entry, index) => {
      const subjectName = entry.subjectId.name;
      const subjectAmount = entry.subjectTotal;
      const subjectSem = entry.semester;
      totalBreakdown += subjectAmount;

      const subjectHeight = doc.heightOfString(subjectName, {
        width: colWidths.subject - 10, align: "left",
      });
      const rowHeight = Math.max(22, subjectHeight + 10);

      // Page break check
      if (yTable + rowHeight > doc.page.height - 120) {
        doc.addPage();
        ({ tableLeftX, colWidths, tableWidth } = drawTableHeader(50));
        yTable = 74;
      }

      if (index % 2 === 0) {
        doc.rect(tableLeftX, yTable, tableWidth, rowHeight).fillAndStroke("#f8f9f9", "#b2bec3");
      } else {
        doc.rect(tableLeftX, yTable, tableWidth, rowHeight).strokeColor("#b2bec3").stroke();
      }

      doc.font("Helvetica").fontSize(11).fillColor("black")
        .text(index + 1, tableLeftX + 5, yTable + 6, { width: colWidths.no - 10 })
        .text(subjectName, tableLeftX + colWidths.no + 5, yTable + 6, { width: colWidths.subject - 10 })
        .text(subjectSem.toString(), tableLeftX + colWidths.no + colWidths.subject + 5, yTable + 6, { width: colWidths.semester - 10, align: "center" })
        .text(`Rs. ${subjectAmount.toFixed(2)}`, tableLeftX + colWidths.no + colWidths.subject + colWidths.semester + 5, yTable + 6, { width: colWidths.amount - 10, align: "right" });

      yTable += rowHeight;
    });

    doc.rect(tableLeftX, doc.y, tableWidth, yTable - doc.y).lineWidth(1).strokeColor("#b2bec3").stroke();
    doc.y = yTable + 20;

    // =============== SALARY BOXES ===============
    const salaryBoxY = doc.y;
    doc.rect(50, salaryBoxY, 500, 60).fillAndStroke("#fef9e7", "#f7ca18").fillColor("black");

    doc.font("Helvetica-Bold").fontSize(12).fillColor("#b9770e")
      .text("Base Salary:", 60, salaryBoxY + 10)
      .font("Helvetica").fillColor("black").text(`Rs. ${payment.baseSalary.toFixed(2)}`, 180, salaryBoxY + 10)
      .font("Helvetica-Bold").fillColor("#b9770e").text("Travel Allowance:", 60, salaryBoxY + 28)
      .font("Helvetica").fillColor("black").text(`Rs. ${payment.travelAllowance.toFixed(2)}`, 180, salaryBoxY + 28)
      .font("Helvetica-Bold").fillColor("#b9770e").text("Duties Total:", 320, salaryBoxY + 10)
      .font("Helvetica").fillColor("black").text(`Rs. ${payment.totalRemuneration.toFixed(2)}`, 440, salaryBoxY + 10);

    doc.moveDown(3);

    const boxY = doc.y;
    doc.rect(50, boxY, 500, 36).fillAndStroke("#d4efdf", "#229954").fillColor("black");
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#229954")
      .text("Total :", 60, boxY + 10)
      .font("Helvetica-Bold").fillColor("#145a32")
      .text(`Rs. ${payment.totalAmount.toFixed(2)}`, 400, boxY + 10, { width: 130, align: "right" });

    const amountWords = toWords(payment.totalAmount).toUpperCase();
    doc.moveDown(2).font("Helvetica-Bold").fontSize(11).fillColor("#2e4053")
      .text(`Amount in words:`, 50)
      .font("Helvetica").fillColor("black")
      .text(`${amountWords} ONLY`, 180);

    // FOOTER
    doc.moveDown(2);
    doc.font("Helvetica-Bold").fontSize(11).fillColor("#2874a6")
      .text("Payment Mode:", 50, doc.y)
      .font("Helvetica").fillColor("black").text("NEFT/UPI", 150, doc.y - 15);

    doc.font("Helvetica-Bold").fontSize(11).fillColor("#7d6608")
      .text("For Principal", 0, doc.y - 15, { align: "right" });

    doc.moveDown(2).fontSize(9).fillColor("#616a6b")
      .text("Note: This is a system-generated slip. Signature not required.", { align: "center" });

    // PAGE NUMBERS
    const totalPages = doc.bufferedPageRange().count;
    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor("gray").text(
        `Page ${i + 1} of ${totalPages}`,
        50,
        doc.page.height - 40,
        { align: "center", width: doc.page.width - 100 }
      );
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating PDF.");
  }
};
 */

// URL : /payment/generate-pdf/:facultyId/:academicYear
exports.getYearPDF = async (req, res) => {
  try {
    const { facultyId, academicYear } = req.params;

    // Fetch Odd + Even payments
    const payments = await Payment.find({ facultyId, academicYear })
      .populate("facultyId")
      .populate("subjectBreakdown.subjectId");

    if (!payments || payments.length === 0) {
      return res.status(404).send("Payments not found for this faculty/year");
    }

    // ✅ Ensure all payments are paid
    const allPaid = payments.every((p) => p.status === "paid");
    if (!allPaid) {
      return res.status(400).json({
        message:
          "Slip can only be generated after all semester payments are successful",
      });
    }

    // payments is an array, not a single document.
    // So payments.status will always be undefined → which means your yearly slip will always fail with the "not paid" error.
    // To fix, we check each payment's status above.
    // ❌ Block slip generation if not paid
    // if (payments.status !== "paid") {
    //   return res.status(400).json({
    //     message: "Slip can only be generated after payment is successful",
    //   });
    // }

    // Separate Odd & Even
    const oddPayment = payments.find((p) => p.semesterType === "Odd");
    const evenPayment = payments.find((p) => p.semesterType === "Even");

    // Keep bufferPages enabled for page numbering
    const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
    const fileName = `Yearly_Remuneration_${payments[0].facultyId.name}_${academicYear}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
    doc.pipe(res);

    // ========== HEADER UI ==========
    const logoPath = path.join(__dirname, "../public/logo.jpg");
    doc
      .rect(40, 25, 530, 90)
      .fillAndStroke("#f5f7fa", "#2c3e50")
      .fillColor("black");
    doc.image(logoPath, 55, 35, { width: 60, align: "left" });

    doc
      .fontSize(20)
      .fillColor("#2c3e50")
      .font("Helvetica-Bold")
      .text("RIZVI EDUCATION SOCIETY", 0, 40, { align: "center" })
      .fontSize(15)
      .text("Rizvi College of Engineering", { align: "center" })
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#34495e")
      .text("Approved by AICTE | Affiliated to University of Mumbai", {
        align: "center",
      })
      .text("Off Carter Road, Bandra (W), Mumbai - 400050", {
        align: "center",
      });

    doc
      .moveTo(40, 120)
      .lineTo(570, 120)
      .lineWidth(2)
      .strokeColor("#2c3e50")
      .stroke();

    // Faculty Details Box
    doc.moveDown(1).fontSize(11);
    const leftX = 50,
      rightX = 320,
      spacing = 20;
    let y = 130;

    const faculty = payments[0].facultyId;

    doc
      .rect(40, y - 8, 530, 90)
      .fillAndStroke("#eaf6fb", "#b2bec3")
      .fillColor("black");
    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Faculty Name:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(faculty.name, leftX + 110, y);

    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Academic Year:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(academicYear, rightX + 120, y);
    y += spacing;

    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Department:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(faculty.department, leftX + 110, y);

    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Designation:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(faculty.designation || "Faculty", rightX + 120, y);
    y += spacing;

    doc.font("Helvetica-Bold").fillColor("#2c3e50").text("Email:", leftX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(faculty.email, leftX + 110, y);

    doc
      .font("Helvetica-Bold")
      .fillColor("#2c3e50")
      .text("Generated Date:", rightX, y);
    doc
      .font("Helvetica")
      .fillColor("black")
      .text(moment().format("DD-MM-YYYY"), rightX + 120, y);

    doc.moveDown(1.5);

    // ========== FUNCTION TO DRAW SUBJECT TABLE ==========
    const drawTable = (title, subjectBreakdown) => {
      const tableLeftX = 50;
      const colWidths = { no: 40, subject: 230, semester: 100, amount: 100 };
      const tableWidth =
        colWidths.no +
        colWidths.subject +
        colWidths.semester +
        colWidths.amount;

      // Section Heading
      const headingY = doc.y + 10;
      const headingHeight = 26;
      const headingWidth = 200;

      doc
        .rect(tableLeftX, headingY, headingWidth, headingHeight)
        .fill("#117864");
      doc
        .font("Helvetica-Bold")
        .fontSize(13)
        .fillColor("white")
        .text(title, tableLeftX + 8, headingY + 6, { align: "left" });

      doc.moveDown(2);

      // Header Row
      const headerY = doc.y;
      const headerHeight = 28;

      doc
        .rect(tableLeftX, headerY, tableWidth, headerHeight)
        .fillAndStroke("#d1f2eb", "#b2bec3");

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#117864")
        .text("No.", tableLeftX, headerY + 8, {
          width: colWidths.no,
          align: "center",
        })
        .text("Subject", tableLeftX + colWidths.no, headerY + 8, {
          width: colWidths.subject,
          align: "center",
        })
        .text(
          "Semester",
          tableLeftX + colWidths.no + colWidths.subject,
          headerY + 8,
          {
            width: colWidths.semester,
            align: "center",
          }
        )
        .text(
          "Amount (Rs.)",
          tableLeftX + colWidths.no + colWidths.subject + colWidths.semester,
          headerY + 8,
          {
            width: colWidths.amount - 5,
            align: "right",
          }
        );

      let yTable = headerY + headerHeight;
      let total = 0;

      subjectBreakdown.forEach((entry, index) => {
        const subjectName = entry.subjectId?.name || "Unknown";
        const subjectAmount = entry.subjectTotal;
        const subjectSem = entry.semester;
        total += subjectAmount;

        const subjectHeight = doc.heightOfString(subjectName, {
          width: colWidths.subject - 10,
        });
        const rowHeight = Math.max(28, subjectHeight + 12);

        if (yTable + rowHeight > doc.page.height - 120) {
          doc.addPage();
          yTable = 50;
        }

        if (index % 2 === 0) {
          doc
            .rect(tableLeftX, yTable, tableWidth, rowHeight)
            .fillAndStroke("#f8f9f9", "#b2bec3");
        } else {
          doc
            .rect(tableLeftX, yTable, tableWidth, rowHeight)
            .fillAndStroke("#ffffff", "#b2bec3");
        }

        const textY = yTable + (rowHeight - 12) / 2;

        doc
          .font("Helvetica")
          .fontSize(11)
          .fillColor("black")
          .text(index + 1, tableLeftX, textY, {
            width: colWidths.no,
            align: "center",
          })
          .text(subjectName, tableLeftX + colWidths.no + 5, textY, {
            width: colWidths.subject - 10,
          })
          .text(
            subjectSem.toString(),
            tableLeftX + colWidths.no + colWidths.subject,
            textY,
            {
              width: colWidths.semester,
              align: "center",
            }
          )
          .text(
            `Rs. ${subjectAmount.toFixed(2)}`,
            tableLeftX + colWidths.no + colWidths.subject + colWidths.semester,
            textY,
            {
              width: colWidths.amount - 10,
              align: "right",
            }
          );

        yTable += rowHeight;
      });

      const totalRowHeight = 30;
      if (yTable + totalRowHeight > doc.page.height - 120) {
        doc.addPage();
        yTable = 50;
      }

      doc
        .rect(tableLeftX, yTable, tableWidth, totalRowHeight)
        .fillAndStroke("#e8f8f5", "#117864");

      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("#117864")
        .text("Total", tableLeftX + colWidths.no, yTable + 8, {
          width: colWidths.subject + colWidths.semester,
          align: "right",
        })
        .text(
          `Rs. ${total.toFixed(2)}`,
          tableLeftX + colWidths.no + colWidths.subject + colWidths.semester,
          yTable + 8,
          {
            width: colWidths.amount - 10,
            align: "right",
          }
        );

      doc.moveDown(2);
      return total;
    };

    const oddTotal = oddPayment
      ? drawTable("Odd Semester Subjects", oddPayment.subjectBreakdown)
      : 0;
    const evenTotal = evenPayment
      ? drawTable("Even Semester Subjects", evenPayment.subjectBreakdown)
      : 0;

    // Salary Totals
    /* const totalBase =
      (oddPayment?.baseSalary || 0) + (evenPayment?.baseSalary || 0); */
    const totalTravel =
      (oddPayment?.travelAllowance || 0) + (evenPayment?.travelAllowance || 0);
    const totalRem =
      (oddPayment?.totalRemuneration || 0) +
      (evenPayment?.totalRemuneration || 0);
    const totalAmt =
      (oddPayment?.totalAmount || 0) + (evenPayment?.totalAmount || 0);

    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }

    const salaryBoxY = doc.y;
    doc
      .rect(50, salaryBoxY, 500, 60)
      .fillAndStroke("#fef9e7", "#f7ca18")
      .fillColor("black");
    doc
      /* .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#b9770e")
      .text("Base Salary:", 60, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Rs. ${totalBase.toFixed(2)}`, 180, salaryBoxY + 10) */
      .font("Helvetica-Bold")
      .fillColor("#b9770e")
      .text("Travel Allowance:", 60, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Rs. ${totalTravel.toFixed(2)}`, 180, salaryBoxY + 10)
      .font("Helvetica-Bold")
      .fillColor("#b9770e")
      .text("Duties Total:", 320, salaryBoxY + 10)
      .font("Helvetica")
      .fillColor("black")
      .text(`Rs. ${totalRem.toFixed(2)}`, 440, salaryBoxY + 10);

    doc.moveDown(2);

    const boxY = doc.y;
    doc
      .rect(50, boxY, 500, 36)
      .fillAndStroke("#d4efdf", "#229954")
      .fillColor("black");
    doc
      .font("Helvetica-Bold")
      .fontSize(14)
      .fillColor("#229954")
      .text("Total :", 60, boxY + 10)
      .font("Helvetica-Bold")
      .fillColor("#145a32")
      .text(`Rs. ${totalAmt.toFixed(2)}`, 400, boxY + 10, {
        width: 130,
        align: "right",
      });

    const amountWords = toWords(totalAmt).toUpperCase();
    doc
      .moveDown(1.5)
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#2e4053")
      .text("Amount in words:", 50)
      .font("Helvetica")
      .fillColor("black")
      .text(`${amountWords} ONLY`, 180);

    doc.moveDown(1.5);
    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#2874a6")
      .text("Payment Mode:", 50, doc.y)
      .font("Helvetica")
      .fillColor("black")
      .text("NEFT/UPI", 150, doc.y - 15);

    doc
      .font("Helvetica-Bold")
      .fontSize(11)
      .fillColor("#7d6608")
      .text("For Principal", 0, doc.y - 15, { align: "right" });

    doc
      .moveDown(1.5)
      .fontSize(9)
      .fillColor("#616a6b")
      .text("Note: This is a system-generated slip. Signature not required.", {
        align: "center",
      });

    // ========= REMOVE EXTRA BLANK PAGE BEFORE PAGE NUMBERS =========
    let range = doc.bufferedPageRange();
    if (range.count > 1) {
      const lastPageIndex = range.start + range.count - 1;
      doc.switchToPage(lastPageIndex);
      if (doc.y <= doc.page.margins.top && doc.page.annotations.length === 0) {
        doc._pageBuffer.pop();
        range.count -= 1;
      }
    }

    // Page Numbers
    range = doc.bufferedPageRange();
    for (let i = 0; i < range.count; i++) {
      doc.switchToPage(i);
      doc
        .fontSize(9)
        .fillColor("gray")
        .text(`Page ${i + 1} of ${range.count}`, 50, doc.page.height - 40, {
          align: "center",
          width: doc.page.width - 100,
        });
    }

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating yearly PDF.");
  }
};
