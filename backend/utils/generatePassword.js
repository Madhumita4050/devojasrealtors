/**
 * Auto-generates a strong-but-readable password for new Associates.
 * Format example: Dj#4821Kf  (mix of letters, numbers, one symbol)
 * Associates don't choose their own password — system generates it,
 * shows it once on screen, and emails it to them.
 */
const generatePassword = () => {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '@#$%!';

  const pick = (str, count) =>
    Array.from({ length: count }, () => str[Math.floor(Math.random() * str.length)]).join('');

  // 4 letters + 3 numbers + 1 symbol, shuffled — 8 chars, easy to read out loud
  const raw = pick(letters, 4) + pick(numbers, 3) + pick(symbols, 1);
  return raw.split('').sort(() => Math.random() - 0.5).join('');
};

module.exports = generatePassword;
