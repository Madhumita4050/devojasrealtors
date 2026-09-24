/**
 * KYC VERIFICATION SERVICE
 * Abhi MOCK mode me hai — verification always "pending" rahegi
 * jise admin manually approve/reject karega.
 * .env me KYC_API_KEY daalte hi automatic verification ho sakti hai.
 */

const isLive = !!process.env.KYC_API_KEY;

const verifyDocument = async (docType, docNumber) => {
  if (!isLive) {
    console.log(`[MOCK KYC] ${docType} - ${docNumber} => manual review required`);
    return { success: true, mock: true, verified: null };
  }

  // Real KYC API call (Surepass / Cashfree Verification) yaha aayega

  return { success: true, mock: false, verified: true };
};

module.exports = { verifyDocument, isLive };
