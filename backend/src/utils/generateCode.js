// Generates short, human-readable reference codes, e.g. ORD-240912-4F82
const generateCode = (prefix = 'REF') => {
  const date = new Date();
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const rand = Math.random().toString(16).slice(2, 6).toUpperCase();
  return `${prefix}-${y}${m}${d}-${rand}`;
};

module.exports = generateCode;
