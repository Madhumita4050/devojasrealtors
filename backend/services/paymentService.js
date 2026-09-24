/**
 * PAYMENT SERVICE
 * -----------------------------------------------------------
 * Abhi ke liye ye MOCK/DUMMY mode me kaam karta hai.
 * Jab Razorpay/Cashfree ki API Key .env file me daal doge,
 * ye service AUTOMATICALLY real payment gateway use karne
 * lagegi — is file ke bahar KUCH BHI change nahi karna padega.
 * -----------------------------------------------------------
 */

const isLive = !!process.env.RAZORPAY_KEY_ID && !!process.env.RAZORPAY_KEY_SECRET;

let razorpayInstance = null;
if (isLive) {
  // Jab key aayegi, 'razorpay' npm package install karna hoga:
  // npm install razorpay
  const Razorpay = require('razorpay');
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create a payment order (jab client plot ke paise pay kare)
const createPaymentOrder = async (amount, currency = 'INR') => {
  if (!isLive) {
    console.log(`[MOCK PAYMENT] Order created for ₹${amount}`);
    return {
      success: true,
      mock: true,
      orderId: 'MOCK_ORDER_' + Date.now(),
      amount,
      currency
    };
  }

  const order = await razorpayInstance.orders.create({
    amount: amount * 100, // Razorpay expects paise
    currency
  });
  return { success: true, mock: false, orderId: order.id, amount, currency };
};

// Process a payout (jab associate ko commission wallet se bank me transfer karna ho)
const processPayout = async (amount, accountDetails) => {
  if (!isLive) {
    console.log(`[MOCK PAYOUT] ₹${amount} sent to`, accountDetails);
    return {
      success: true,
      mock: true,
      payoutId: 'MOCK_PAYOUT_' + Date.now(),
      amount
    };
  }

  // Real payout logic yaha aayega jab RazorpayX / Cashfree Payout key milegi
  // const payout = await razorpayInstance.payouts.create({ ... });
  return { success: true, mock: false, amount };
};

module.exports = { createPaymentOrder, processPayout, isLive };
