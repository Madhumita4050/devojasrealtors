const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const receiptsDir = path.join(__dirname, '..', 'uploads', 'receipts');
if (!fs.existsSync(receiptsDir)) fs.mkdirSync(receiptsDir, { recursive: true });

const ROYAL_BLUE = '#1E3A8A';
const SKY_BLUE = '#0284C7';
const BORDER_BLUE = '#1E40AF';
const GRAY = '#4B5563';
const DARK = '#111827';

const formatMoney = (n) => `Rs. ${Number(n || 0).toLocaleString('en-IN')}`;

/**
 * Generates the "Plot Price Details" booking PDF for a transaction
 * (mirrors the exact structure of the uploaded form with Royal Blue branding)
 */
const generateBookingPdf = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const { transaction, plot, buyer, companySettings, emiPlan } = data;
      const fileName = `booking-txn-${transaction.id}.pdf`;
      const filePath = path.join(receiptsDir, fileName);

      const doc = new PDFDocument({ size: 'A4', margin: 25 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth = 595.28;
      const pageHeight = 841.89;
      const margin = 25;
      const contentWidth = pageWidth - (margin * 2);

      // Outer Royal Blue Border (as seen on the uploaded form)
      doc.rect(margin, margin, contentWidth, pageHeight - (margin * 2))
        .lineWidth(4)
        .strokeColor(BORDER_BLUE)
        .stroke();

      let y = margin + 8;

      // ---------- HEADER: Company Branding ----------
      doc.rect(margin + 4, y, contentWidth - 8, 38).fill(ROYAL_BLUE);
      doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16)
        .text(companySettings?.company_name || 'DEVOJAS REALTORS', margin + 12, y + 8);
      doc.font('Helvetica').fontSize(8.5).fillColor('#E0E7FF')
        .text(companySettings?.tagline || 'Your Trusted Real Estate Partner', margin + 12, y + 24);
      doc.fillColor(DARK);

      y += 46;

      // Helper function for section banner
      const drawSectionBanner = (title, curY) => {
        doc.rect(margin + 4, curY, contentWidth - 8, 22).fill(ROYAL_BLUE);
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(11)
          .text(title, margin + 12, curY + 6);
        doc.fillColor(DARK);
        return curY + 28;
      };

      // ---------- 1. PLOT PRICE DETAILS ----------
      y = drawSectionBanner('PLOT PRICE DETAILS', y);

      const ratePerSqft = plot?.price && plot?.size_sqft
        ? Math.round(plot.price / plot.size_sqft)
        : (plot?.rate_per_sqft || '-');

      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(DARK);
      doc.text('Project Name: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(plot?.title || 'Residential Township');
      y += 18;

      doc.font('Helvetica-Bold').text('Plot Size: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(`${plot?.size_sqft || '---'} Sq.ft.         Sector No.: ${plot?.block || plot?.sector || '---'}         Plot No.: ${plot?.plot_number || plot?.id || '---'}`);
      y += 18;

      doc.font('Helvetica-Bold').text('Rate: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(`Rs. ${ratePerSqft} Per Sq.ft.  (for Latest Rate @ always confirm at Head Office)`);
      y += 18;

      doc.font('Helvetica-Bold').text('Basic Plot Price Rs.: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(formatMoney(transaction?.amount || plot?.price));
      y += 18;

      doc.font('Helvetica-Bold').text('Corner: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(`${plot?.is_corner ? '10' : '0'} %         Park Facing: ${plot?.facing === 'park' ? '10' : '0'} %`);
      y += 24;

      // ---------- 2. PAYMENT PLAN OPTION ----------
      y = drawSectionBanner('PAYMENT PLAN OPTION', y);

      const totalPlotPrice = parseFloat(transaction?.amount || 0);
      const paidAmt = parseFloat(transaction?.paid_amount || 0);
      const pendingAmt = totalPlotPrice - paidAmt;

      doc.font('Helvetica-Bold').fontSize(9.5).fillColor(DARK);
      doc.text('A. 100% Plot Amount (Full Plot Amount)', margin + 12, y);
      doc.text(`Total Plot Price: ${formatMoney(totalPlotPrice)}`, margin + 300, y);
      y += 18;

      doc.font('Helvetica-Bold').text('B. Payment Mode: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(emiPlan ? 'Down Payment + Monthly EMI' : (transaction?.payment_mode || 'Direct / Bank Transfer'));
      y += 18;

      doc.font('Helvetica-Bold').text('C. Down Payment Plan (EMI)', margin + 12, y);
      y += 16;

      if (emiPlan) {
        doc.font('Helvetica').text(`    EMI Duration: ${emiPlan.num_months} Months        Down Payment Amt. Rs.: ${formatMoney(emiPlan.down_payment)}`, margin + 12, y);
        y += 16;
        doc.text(`    Monthly EMI Amount: ${formatMoney(emiPlan.monthly_amount)} / month        Start Date: ${emiPlan.start_date || 'Booking Date'}`, margin + 12, y);
      } else {
        doc.font('Helvetica').text(`    Amount Paid: ${formatMoney(paidAmt)}        Balance Pending: ${formatMoney(pendingAmt)}`, margin + 12, y);
      }
      y += 24;

      // ---------- 3. NOTE / TERMS & CONDITIONS ----------
      y = drawSectionBanner('NOTE / TERMS & CONDITIONS', y);

      const notes = [
        'Date of Booking refers to when application for booking is submitted to the developer.',
        'Service Tax / GST as applicable shall be paid extra in accordance with law.',
        'Other charges (if any) shall be payable by customer as per terms and conditions of booking.',
        'Booking amt. 25%-50% but adjustable when plot purchase at any location once. Valid for One Plot.',
        'Preferential Location Charges applied as per company norms.',
        'If down payment plan opted and EMI is not paid timely, then an additional charges will be applied or plot may be cancelled if certain no. of EMI is pending continuously.',
        'For more information & latest terms & conditions for the same, please always contact or visit to our Head Office.'
      ];

      doc.font('Helvetica').fontSize(8).fillColor(GRAY);
      notes.forEach((note) => {
        doc.text(`• ${note}`, margin + 12, y, { width: contentWidth - 24 });
        y += doc.heightOfString(`• ${note}`, { width: contentWidth - 24 }) + 3;
      });
      y += 12;

      // ---------- 4. APPLICANT DETAILS ----------
      doc.rect(margin + 4, y, contentWidth - 8, 1).strokeColor('#E2E8F0').stroke();
      y += 10;

      doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK);
      doc.text('Name of Applicant: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(buyer?.name || '---');
      y += 16;

      doc.font('Helvetica-Bold').text('Date: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(new Date(transaction?.deal_date || transaction?.createdAt || Date.now()).toLocaleDateString('en-IN'));
      y += 16;

      doc.font('Helvetica-Bold').text('Place: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(companySettings?.company_address ? companySettings.company_address.split(',')[0] : 'Head Office');

      doc.text('_____________________________', margin + 350, y - 10);
      doc.font('Helvetica-Bold').fontSize(8.5).text('Signature of the Applicant', margin + 360, y + 6);
      y += 26;

      // ---------- 5. FOR OFFICE USE ONLY ----------
      y = drawSectionBanner('FOR OFFICE USE ONLY', y);

      doc.font('Helvetica-Bold').fontSize(9).fillColor(DARK);
      doc.text('Name of Applicant: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(buyer?.name || '---');
      y += 16;

      doc.font('Helvetica-Bold').text('Date: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text(new Date(transaction?.deal_date || transaction?.createdAt || Date.now()).toLocaleDateString('en-IN'));
      y += 16;

      doc.font('Helvetica-Bold').text('Place: ', margin + 12, y, { continued: true });
      doc.font('Helvetica').text('Devojas Head Office');

      doc.text('_____________________________', margin + 350, y - 10);
      doc.font('Helvetica-Bold').fontSize(8.5).text('Authorised Signature', margin + 375, y + 6);

      doc.end();
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = { generateBookingPdf, receiptsDir };
