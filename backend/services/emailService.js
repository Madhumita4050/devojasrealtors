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

/**
 * Universal credentials email — sent to ALL users when admin creates them.
 * Works for associates, clients, accounts staff, etc.
 */
const sendCredentialsEmail = async (user, loginId, plainPassword) => {
  if (!user.email) return { success: false, mock: !isLive, message: 'No email provided' };

  const roleLabel = {
    associate: 'Associate',
    client: 'Client',
    accounts: 'Accounts Staff',
    admin: 'Administrator'
  }[user.role] || 'User';

  const subject = `Welcome to DEVOJAS REALTORS — Your Login Credentials`;
  const text =
    `Hi ${user.name},\n\n` +
    `Your ${roleLabel} account has been created at DEVOJAS REALTORS.\n\n` +
    `Login ID : ${loginId}\n` +
    `Password : ${plainPassword}\n\n` +
    `Please login at our portal (http://localhost:5173/login or your production URL) and change your password after first login.\n\n` +
    `Regards,\nDEVOJAS REALTORS`;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;border:1px solid #e5e7eb;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
      <div style="background:linear-gradient(135deg,#1E3A8A,#1d4ed8);color:#fff;padding:28px 24px;text-align:center">
        <h2 style="margin:0;font-size:22px;letter-spacing:2px">DEVOJAS REALTORS</h2>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">Account Created Successfully</p>
      </div>
      <div style="padding:28px 24px">
        <p style="margin:0 0 16px">Hi <strong>${user.name}</strong>,</p>
        <p style="color:#4b5563;margin:0 0 20px">Your <strong>${roleLabel}</strong> account has been created. Below are your login credentials:</p>
        <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:10px;overflow:hidden;margin-bottom:20px">
          <tr style="border-bottom:1px solid #e5e7eb">
            <td style="padding:12px 16px;color:#6b7280;font-size:13px">Login ID</td>
            <td style="padding:12px 16px;font-weight:700;font-size:15px;color:#1E3A8A;letter-spacing:1px">${loginId}</td>
          </tr>
          <tr>
            <td style="padding:12px 16px;color:#6b7280;font-size:13px">Password</td>
            <td style="padding:12px 16px;font-weight:700;font-size:15px;color:#1E3A8A;letter-spacing:1px">${plainPassword}</td>
          </tr>
          ${user.referral_code ? `
          <tr style="border-top:1px solid #e5e7eb">
            <td style="padding:12px 16px;color:#6b7280;font-size:13px">Referral Code</td>
            <td style="padding:12px 16px;font-weight:700;font-size:15px;color:#1E3A8A">${user.referral_code}</td>
          </tr>` : ''}
        </table>
        <div style="text-align:center;margin-bottom:20px;">
          <a href="http://localhost:5173/login" style="display:inline-block;padding:12px 24px;background-color:#1E3A8A;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:14px;letter-spacing:0.5px;">Log In Now</a>
        </div>
        <div style="background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;font-size:13px;color:#92400e;margin-bottom:20px">
          ⚠️ Please change your password after your first login for security.
        </div>
        <p style="font-size:12px;color:#9ca3af;text-align:center;margin:0">This is a system-generated email. Please do not reply to this email.</p>
      </div>
      <div style="background:#f8fafc;padding:14px;text-align:center;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:11px;color:#9ca3af">© ${new Date().getFullYear()} DEVOJAS REALTORS. All rights reserved.</p>
      </div>
    </div>`;

  return sendEmail(user.email, subject, text, html);
};

module.exports = { sendEmail, sendAssociateCredentials, sendCredentialsEmail, sendBookingPdf, isLive };
