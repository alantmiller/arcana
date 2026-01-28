/**
 * Arcana: AI-Inspired Signature Encoding
 * Core encoding/decoding logic
 */

// Symbol mapping for hex digits (0-f) to geometric symbols
export const symbolMap: Record<string, string> = {
  '0': '□', '1': '■', '2': '◇', '3': '◆',
  '4': '○', '5': '●', '6': '△', '7': '▲',
  '8': '▽', '9': '▼', 'a': '◻', 'b': '◼',
  'c': '◯', 'd': '★', 'e': '☆', 'f': '◎',
};

// Reverse mapping for decoding
export const reverseSymbolMap: Record<string, string> = Object.fromEntries(
  Object.entries(symbolMap).map(([k, v]) => [v, k])
);

// Vector quantization symbols (for demo only, not used in signature encoding)
export const vqSymbols = ['≈', '∆', '≋', '∇'];

/**
 * Input data for signature generation
 */
export interface SignatureInput {
  name: string;
  company?: string;
  email: string;
  website?: string;
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean;
  message?: string;
}

/**
 * VQ demo result
 */
export interface VQResult {
  original: string;
  quantizedIndices: number[];
  symbols: string;
}

/**
 * Generate an Arcana signature from input data
 * Encodes text → hex → geometric symbols
 * Includes hidden GitHub URL
 */
export function generateArcanaSignature(input: SignatureInput): string {
  const hiddenUrl = 'https://github.com/alantmiller/arcana';

  const parts: string[] = [input.name];
  if (input.company) parts.push(input.company);
  if (input.email) parts.push(input.email);
  if (input.website) parts.push(input.website);

  // Check if user provided any content before adding hidden URL
  const userContent = parts.filter(p => p).join(' | ');
  if (!userContent) return '';

  parts.push(hiddenUrl);
  const message = parts.filter(p => p).join(' | ');

  // Encode message to UTF-8 bytes
  const encoder = new TextEncoder();
  const bytes = encoder.encode(message);

  // Convert bytes to hex string
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  // Map hex characters to geometric symbols
  const encoded = hex.split('').map(h => symbolMap[h]).join('');

  // Wrap at 60 characters for email compatibility
  const wrapped = encoded.match(/.{1,60}/g)?.join('\n') || encoded;

  return `${message}\n\n${wrapped}`;
}

/**
 * Validate input for copy/email actions
 */
export function validateInputForAction(input: SignatureInput): ValidationResult {
  if (input.name.length < 3) {
    return { valid: false, message: 'Name should be at least 3 characters.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(input.email)) {
    return { valid: false, message: 'Please enter a valid email address.' };
  }

  return { valid: true };
}

/**
 * Decode geometric symbols back to original text
 * Symbols → hex → UTF-8 bytes → text
 */
export function decodeSymbols(encodedText: string): { success: boolean; message: string } {
  const input = encodedText.trim().replace(/\s/g, '');

  if (input.length < 42) {
    return {
      success: false,
      message: 'Error: Encoded block must be at least 42 characters.',
    };
  }

  // Convert symbols back to hex
  let hex = '';
  for (const char of input) {
    if (reverseSymbolMap[char]) {
      hex += reverseSymbolMap[char];
    }
  }

  if (hex.length % 2 !== 0) {
    return {
      success: false,
      message: 'Error: Invalid encoding (odd hex length).',
    };
  }

  try {
    // Convert hex to bytes
    const bytes = new Uint8Array(
      hex.match(/.{2}/g)!.map(h => parseInt(h, 16))
    );

    // Decode UTF-8 bytes to text
    const decoded = new TextDecoder().decode(bytes);

    return {
      success: true,
      message: decoded,
    };
  } catch {
    return {
      success: false,
      message: 'Error: Failed to decode.',
    };
  }
}

/**
 * Vector Quantization demo (educational, not used in signatures)
 * Characters → normalized values → quantized bins → VQ symbols
 */
export function performVectorQuantization(text: string): VQResult | null {
  if (!text) return null;

  // Normalize character codes to [0, 1]
  const vector = Array.from(text).map(c => c.charCodeAt(0) / 255);

  // Quantize to 4 bins (0-3)
  const quantized = vector.map(v => Math.min(3, Math.floor(v * 4)));

  // Map bins to VQ symbols
  const symbols = quantized.map(q => vqSymbols[q]).join('');

  return {
    original: text,
    quantizedIndices: quantized,
    symbols,
  };
}
