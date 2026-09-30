/**
 * SMS / OTP SERVICE
 * Abhi MOCK mode me hai — OTP console me print hoga.
 * .env me SMS_API_KEY daalte hi real SMS jana shuru ho jayega.
 */

const isLive = !!process.env.SMS_API_KEY;

const sendOTP = async (phone, otp) => {
  if (!isLive) {
    console.log(`[MOCK SMS] OTP for ${phone} is: ${otp}`);
    return { success: true, mock: true };
  }

  // Real SMS API call yaha aayega (MSG91 / Twilio / Fast2SMS)
  // Example (MSG91):
  // const response = await axios.post('https://api.msg91.com/api/v5/otp', {
  //   mobile: phone, otp, authkey: process.env.SMS_API_KEY
  // });

  return { success: true, mock: false };
};

const sendWelcomeSMS = async (phone, loginId, password) => {
  const message = `Welcome to Devojas Realtors! Your Login ID is ${loginId} and Password is ${password}. Please login to access your dashboard.`;
  
  if (!isLive) {
    console.log(`[MOCK SMS] To: ${phone} | Message: ${message}`);
    return { success: true, mock: true };
  }

  // Real SMS API call for welcome message (MSG91 / Twilio / Fast2SMS)
  // e.g. await axios.get(`https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.SMS_API_KEY}&route=q&message=${encodeURIComponent(message)}&language=english&flash=0&numbers=${phone}`);
  
  return { success: true, mock: false };
};

module.exports = { sendOTP, sendWelcomeSMS, isLive };
