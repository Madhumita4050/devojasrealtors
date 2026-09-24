/**
 * EMAIL SERVICE
 * -------------------------------------------------------------
 * MOCK mode by default — email content sirf console me log hota hai,
 * taaki bina .env configure kiye bhi poora system (associate signup,
 * booking PDF, etc.) bina fail hue chal sake.
 *
 * .env me EMAIL_HOST/EMAIL_USER/EMAIL_PASSWORD daalte hi real email
 * (nodemailer ke through) jana shuru ho jayega — koi code change
 * nahi karna padega.
 * -------------------------------------------------------------
 */
const isLive = !!process.env.EMAIL_HOST && !!process.env.EMAIL_USER && !!process.env.EMAIL_PASSWORD;

let transporter = null;
if (isLive) {
  const nodemailer = require('nodemailer');
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

/**
 * Generic email sender.
 * @param {string} to
 * @param {string} subject
 * @param {string} text - plain text fallback
 * @param {string} [html] - optional HTML body
 * @param {Array}  [attachments] - optional nodemailer attachments [{filename, path}]
 */
const sendEmail = async (to, subject, text, html, attachments) => {
  if (!to) return { success: false, mock: !isLive, message: 'No recipient email address provided' };

  if (!isLive) {
    console.log(`[MOCK EMAIL] To: ${to} | Subject: ${subject}\n${text}`);
    if (attachments && attachments.length) {
      console.log(`[MOCK EMAIL] Attachments: ${attachments.map(a => a.filename).join(', ')}`);
    }
    return { success: true, mock: true };
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || undefined,
      attachments: attachments || undefined
    });
    return { success: true, mock: false };
  } catch (error) {
    console.error('Email send failed:', error.message);
    return { success: false, mock: false, error: error.message };
  }
};

/**
 * Sends a brand-new Associate their login ID + auto-generated password.
 */
const sendAssociateCredentials = async (user, plainPassword) => {
  const loginId = user.email || user.phone;
  const subject = 'Welcome to DEVOJAS REALTORS — Your Associate Login Details';
  const text =
    `Hi ${user.name},\n\n` +
    `Your Associate account has been created successfully.\n\n` +
    `Associate ID (Referral Code): ${user.referral_code}\n` +
    `Login ID (Phone/Email): ${loginId}\n` +
    `Password: ${plainPassword}\n\n` +
    `Please login at the Associate Panel using the above credentials. ` +
    `We recommend changing your password after first login from the Profile page.\n\n` +
    `Your fixed referral commission: 5%\n\n` +
    `Regards,\nDEVOJAS REALTORS`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
      <div style="background:#1E3A8A;color:#fff;padding:20px;text-align:center">
        <h2 style="margin:0">DEVOJAS REALTORS</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:.85">Associate Account Created</p>
      </div>
      <div style="padding:24px">
        <p>Hi <strong>${user.name}</strong>,</p>
        <p>Your Associate account has been created. Please find your login details below:</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#666">Associate ID</td><td style="padding:6px 0;font-weight:bold">${user.referral_code}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Login ID</td><td style="padding:6px 0;font-weight:bold">${loginId}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Password</td><td style="padding:6px 0;font-weight:bold">${plainPassword}</td></tr>
          <tr><td style="padding:6px 0;color:#666">Fixed Commission</td><td style="padding:6px 0;font-weight:bold">5%</td></tr>
        </table>
        <p style="font-size:13px;color:#888">Please change your password after first login from the Profile page.</p>
      </div>
    </div>`;

  return sendEmail(user.email, subject, text, html);
};

/**
 * Sends the booking / plot price details PDF to the client after purchase.
 */
const sendBookingPdf = async (user, pdfPath, plotTitle) => {
  const subject = `Your Plot Booking Details — ${plotTitle || 'DEVOJAS REALTORS'}`;
  const text =
    `Hi ${user.name},\n\nThank you for booking with DEVOJAS REALTORS. ` +
    `Please find your Plot Price Details / Booking form attached.\n\nRegards,\nDEVOJAS REALTORS`;

  return sendEmail(user.email, subject, text, null, [{ filename: 'Plot-Booking-Details.pdf', path: pdfPath }]);
};

module.exports = { sendEmail, sendAssociateCredentials, sendBookingPdf, isLive };
