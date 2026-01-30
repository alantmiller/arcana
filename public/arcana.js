// Arcana Core - Pure Browser JS

export const symbolMap = {
  '0': '□', '1': '■', '2': '◇', '3': '◆',
  '4': '○', '5': '●', '6': '△', '7': '▲',
  '8': '▽', '9': '▼', 'a': '◻', 'b': '◼',
  'c': '◯', 'd': '★', 'e': '☆', 'f': '◎'
};

export const reverseSymbolMap = Object.fromEntries(
  Object.entries(symbolMap).map(([k, v]) => [v, k])
);

export function generateArcanaSignature(input) {
  const hiddenUrl = 'https://github.com/alantmiller/arcana';

  const parts = [input.name];
  if (input.company) parts.push(input.company);
  if (input.email) parts.push(input.email);
  if (input.website) parts.push(input.website);

  const userContent = parts.filter(p => p).join(' | ');
  if (!userContent) return '';

  parts.push(hiddenUrl);
  const message = parts.filter(p => p).join(' | ');

  const encoder = new TextEncoder();
  const bytes = encoder.encode(message);
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const encoded = hex.split('').map(h => symbolMap[h]).join('');
  const wrapped = encoded.match(/.{1,60}/g)?.join('\n') || encoded;

  return `${message}\n\n${wrapped}`;
}

export function decodeSymbols(symbols) {
  if (symbols.length < 42) {
    return { success: false, error: 'Minimum 42 characters required' };
  }

  let hex = '';
  for (const char of symbols) {
    if (reverseSymbolMap[char]) {
      hex += reverseSymbolMap[char];
    }
  }

  if (hex.length % 2 !== 0) {
    return { success: false, error: 'Invalid encoding (odd hex length)' };
  }

  try {
    const bytes = new Uint8Array(
      hex.match(/.{2}/g).map(h => parseInt(h, 16))
    );
    const decoded = new TextDecoder().decode(bytes);
    return { success: true, decoded };
  } catch {
    return { success: false, error: 'Decoding failed' };
  }
}

export function validateInputForAction(input) {
  if (input.name.length < 3) {
    return { valid: false, message: 'Name must be at least 3 characters' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    return { valid: false, message: 'Invalid email address' };
  }

  return { valid: true };
}
