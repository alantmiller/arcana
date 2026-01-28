/**
 * Arcana: DOM bindings and event handlers
 * Connects UI to core logic
 */

import {
  generateArcanaSignature,
  validateInputForAction,
  decodeSymbols,
  performVectorQuantization,
  type SignatureInput,
} from './arcana.ts';

// Only run in browser environment
if (typeof document !== 'undefined') {
  // ====================================
  // Signature Generation
  // ====================================

  function getSignatureInput(): SignatureInput {
    return {
      name: (document.getElementById('name') as HTMLInputElement).value.trim(),
      company: (document.getElementById('company') as HTMLInputElement).value.trim(),
      email: (document.getElementById('email') as HTMLInputElement).value.trim(),
      website: (document.getElementById('website') as HTMLInputElement).value.trim(),
    };
  }

  function updateOutput() {
    const input = getSignatureInput();
    const signature = generateArcanaSignature(input);
    const outputEl = document.getElementById('output')!;
    outputEl.textContent = signature || 'Your signature will appear here as you type...';
  }

  // Real-time update on all form inputs
  document.querySelectorAll('#sigForm input').forEach(input => {
    input.addEventListener('input', updateOutput);
  });
  updateOutput(); // Initial render

  // ====================================
  // Copy Signature
  // ====================================

  document.getElementById('copy-sig-btn')!.addEventListener('click', () => {
    const input = getSignatureInput();
    const validation = validateInputForAction(input);

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const text = document.getElementById('output')!.textContent || '';
    navigator.clipboard.writeText(text).then(() => {
      alert('Signature copied to clipboard!');
    });
  });

  // ====================================
  // Email Signature
  // ====================================

  document.getElementById('email-sig-link')!.addEventListener('click', (e) => {
    e.preventDefault();

    const input = getSignatureInput();
    const validation = validateInputForAction(input);

    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const email = input.email;
    const subject = encodeURIComponent('My New Arcana Signature');
    const body = encodeURIComponent(document.getElementById('output')!.textContent || '');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });

  // ====================================
  // Modal Controls
  // ====================================

  const modal = document.getElementById('decoder-modal')!;
  const openBtn = document.getElementById('open-decoder')!;
  const closeBtn = document.querySelector('.close')!;

  openBtn.onclick = () => (modal as HTMLElement).style.display = 'flex';
  closeBtn.onclick = () => (modal as HTMLElement).style.display = 'none';

  window.onclick = (event) => {
    if (event.target === modal) {
      (modal as HTMLElement).style.display = 'none';
    }
  };

  // ESC key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (modal as HTMLElement).style.display === 'flex') {
      (modal as HTMLElement).style.display = 'none';
    }
  });

  // ====================================
  // Decode Symbols
  // ====================================

  document.getElementById('decode-btn')!.addEventListener('click', () => {
    const input = (document.getElementById('encoded-input') as HTMLTextAreaElement).value;
    const result = decodeSymbols(input);
    document.getElementById('decode-output')!.textContent = result.message;
  });

  // ====================================
  // Copy Decoded Message
  // ====================================

  document.getElementById('copy-decode-btn')!.addEventListener('click', () => {
    const text = document.getElementById('decode-output')!.textContent || '';
    if (text.startsWith('Error')) {
      alert('Nothing valid to copy.');
      return;
    }
    navigator.clipboard.writeText(text).then(() => alert('Decoded message copied!'));
  });

  // ====================================
  // Email Decoded Message
  // ====================================

  document.getElementById('email-decode-link')!.addEventListener('click', (e) => {
    e.preventDefault();

    const text = document.getElementById('decode-output')!.textContent || '';
    if (!text || text.startsWith('Error')) {
      alert('Decode a valid message first.');
      return;
    }

    const email = prompt('Enter your email to send the decoded message:');
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const subject = encodeURIComponent('Decoded Arcana Message');
      const body = encodeURIComponent(text);
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    } else if (email) {
      alert('Invalid email address.');
    }
  });

  // ====================================
  // Vector Quantization Demo
  // ====================================

  function updateVQOutput() {
    const text = (document.getElementById('vq-text') as HTMLInputElement).value.trim();
    const vqOutputEl = document.getElementById('vq-output')!;

    if (!text) {
      vqOutputEl.textContent = '';
      return;
    }

    const result = performVectorQuantization(text);
    if (!result) {
      vqOutputEl.textContent = '';
      return;
    }

    const wrapped = result.symbols.match(/.{1,60}/g)?.join('\n') || result.symbols;
    vqOutputEl.textContent =
      `Original: ${result.original}\nQuantized Indices: [${result.quantizedIndices.join(', ')}]\nSymbols:\n${wrapped}`;
  }

  document.getElementById('vq-text')!.addEventListener('input', updateVQOutput);

  // ====================================
  // Copy VQ Output
  // ====================================

  document.getElementById('copy-vq-btn')!.addEventListener('click', () => {
    const text = document.getElementById('vq-output')!.textContent || '';
    navigator.clipboard.writeText(text).then(() => alert('VQ demo output copied!'));
  });
}
