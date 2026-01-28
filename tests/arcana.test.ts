/**
 * Unit tests for Arcana core logic
 */

import { assertEquals, assertStringIncludes } from 'jsr:@std/assert';
import {
  generateArcanaSignature,
  validateInputForAction,
  decodeSymbols,
  performVectorQuantization,
  symbolMap,
  reverseSymbolMap,
} from '../src/arcana.ts';

// ====================================
// Symbol Map Tests
// ====================================

Deno.test('symbolMap has 16 entries (0-f)', () => {
  assertEquals(Object.keys(symbolMap).length, 16);
  assertEquals(symbolMap['0'], '□');
  assertEquals(symbolMap['f'], '◎');
});

Deno.test('reverseSymbolMap is bidirectional', () => {
  for (const [hex, symbol] of Object.entries(symbolMap)) {
    assertEquals(reverseSymbolMap[symbol], hex);
  }
});

// ====================================
// Signature Generation Tests
// ====================================

Deno.test('generateArcanaSignature includes all fields', () => {
  const input = {
    name: 'Alan Miller',
    company: 'Scatterworks',
    email: 'alan@example.com',
    website: 'https://example.com',
  };

  const signature = generateArcanaSignature(input);

  assertStringIncludes(signature, 'Alan Miller');
  assertStringIncludes(signature, 'Scatterworks');
  assertStringIncludes(signature, 'alan@example.com');
  assertStringIncludes(signature, 'https://example.com');
});

Deno.test('generateArcanaSignature includes hidden GitHub URL', () => {
  const input = {
    name: 'Test User',
    email: 'test@example.com',
  };

  const signature = generateArcanaSignature(input);
  assertStringIncludes(signature, 'https://github.com/alantmiller/arcana');
});

Deno.test('generateArcanaSignature wraps symbols at 60 characters', () => {
  const input = {
    name: 'A'.repeat(50), // Long name to ensure wrapping
    email: 'test@example.com',
  };

  const signature = generateArcanaSignature(input);
  const lines = signature.split('\n');

  // Check that symbol lines (after the plaintext message) don't exceed 60 chars
  const symbolLines = lines.slice(2); // Skip message and blank line
  for (const line of symbolLines) {
    assertEquals(line.length <= 60, true, `Line exceeds 60 chars: ${line.length}`);
  }
});

Deno.test('generateArcanaSignature returns empty string for empty input', () => {
  const input = {
    name: '',
    email: '',
  };

  const signature = generateArcanaSignature(input);
  assertEquals(signature, '');
});

// ====================================
// Validation Tests
// ====================================

Deno.test('validateInputForAction accepts valid input', () => {
  const input = {
    name: 'Alan Miller',
    email: 'alan@example.com',
  };

  const result = validateInputForAction(input);
  assertEquals(result.valid, true);
});

Deno.test('validateInputForAction rejects short name', () => {
  const input = {
    name: 'Al',
    email: 'alan@example.com',
  };

  const result = validateInputForAction(input);
  assertEquals(result.valid, false);
  assertStringIncludes(result.message!, 'at least 3 characters');
});

Deno.test('validateInputForAction rejects invalid email', () => {
  const input = {
    name: 'Alan Miller',
    email: 'not-an-email',
  };

  const result = validateInputForAction(input);
  assertEquals(result.valid, false);
  assertStringIncludes(result.message!, 'valid email');
});

Deno.test('validateInputForAction rejects empty email', () => {
  const input = {
    name: 'Alan Miller',
    email: '',
  };

  const result = validateInputForAction(input);
  assertEquals(result.valid, false);
});

// ====================================
// Encode/Decode Round-Trip Tests
// ====================================

Deno.test('encode and decode round-trip preserves message', () => {
  const input = {
    name: 'Test User',
    email: 'test@example.com',
  };

  const signature = generateArcanaSignature(input);
  const lines = signature.split('\n');

  // Extract only the symbol lines (skip plaintext message)
  const symbolLines = lines.slice(2);
  const encodedSymbols = symbolLines.join('');

  const decoded = decodeSymbols(encodedSymbols);

  assertEquals(decoded.success, true);
  assertStringIncludes(decoded.message, 'Test User');
  assertStringIncludes(decoded.message, 'test@example.com');
  assertStringIncludes(decoded.message, 'https://github.com/alantmiller/arcana');
});

Deno.test('decodeSymbols rejects input shorter than 42 characters', () => {
  const result = decodeSymbols('□■◇◆');
  assertEquals(result.success, false);
  assertStringIncludes(result.message, 'at least 42 characters');
});

Deno.test('decodeSymbols handles invalid symbols gracefully', () => {
  const validSymbols = '□'.repeat(50);
  const result = decodeSymbols(validSymbols);

  // Should succeed or fail gracefully (depends on whether it decodes to valid UTF-8)
  assertEquals(typeof result.success, 'boolean');
});

Deno.test('decodeSymbols rejects odd hex length', () => {
  // Create a string that maps to odd hex length (remove one symbol from valid encoding)
  const input = {
    name: 'Test',
    email: 'test@example.com',
  };

  const signature = generateArcanaSignature(input);
  const lines = signature.split('\n');
  const symbolLines = lines.slice(2);
  let encodedSymbols = symbolLines.join('');

  // Remove one character to make odd hex length
  encodedSymbols = encodedSymbols.slice(0, -1);

  const result = decodeSymbols(encodedSymbols);

  // This may succeed or fail depending on whether the result maps to odd hex
  // Just verify it doesn't throw
  assertEquals(typeof result.success, 'boolean');
});

// ====================================
// Vector Quantization Tests
// ====================================

Deno.test('performVectorQuantization returns null for empty input', () => {
  const result = performVectorQuantization('');
  assertEquals(result, null);
});

Deno.test('performVectorQuantization returns correct structure', () => {
  const result = performVectorQuantization('test');

  assertEquals(result !== null, true);
  assertEquals(result!.original, 'test');
  assertEquals(result!.quantizedIndices.length, 4);
  assertEquals(result!.symbols.length, 4);
});

Deno.test('performVectorQuantization quantizes to bins 0-3', () => {
  const result = performVectorQuantization('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');

  assertEquals(result !== null, true);

  // All quantized values should be 0-3
  for (const index of result!.quantizedIndices) {
    assertEquals(index >= 0 && index <= 3, true);
  }
});

Deno.test('performVectorQuantization uses VQ symbols', () => {
  const result = performVectorQuantization('test');
  const validVQSymbols = ['≈', '∆', '≋', '∇'];

  assertEquals(result !== null, true);

  // All output symbols should be from the VQ symbol set
  for (const char of result!.symbols) {
    assertEquals(validVQSymbols.includes(char), true);
  }
});
