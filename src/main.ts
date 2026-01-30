import {
  generateArcanaSignature,
  decodeSymbols,
  validateInputForAction,
  symbolMap,
  type SignatureInput,
} from './arcana.ts';

import { CharacterTransformation } from './demos/CharacterTransformation.ts';
import { HexPipeline } from './demos/HexPipeline.ts';
import { SymbolAssembly } from './demos/SymbolAssembly.ts';

// Tab Navigation
function initTabNavigation() {
  const nav = document.getElementById('main-nav')!;
  const tabButtons = document.querySelectorAll<HTMLButtonElement>('nav button[data-tab]');
  const tabContents = document.querySelectorAll<HTMLElement>('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.dataset.tab!;

      // Update active states
      tabButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetTab) {
          content.classList.add('active');
        }
      });
    });
  });
}

// Home Tab Animation
function initHomeAnimation() {
  const display = document.getElementById('signature-display')!;
  const explanation = document.getElementById('explanation')!;
  const nav = document.getElementById('main-nav')!;

  // Alan's signature data
  const signature = {
    name: 'Alan T Miller',
    email: 'alan@scatterworks.xyz',
    company: 'Scatterworks',
    website: 'https://scatterworks.xyz',
  };

  const encoded = generateArcanaSignature(signature);
  const lines = encoded.split('\n');
  const symbols = lines.slice(2).join('\n'); // Skip plaintext lines

  // Show encoded symbols
  display.innerHTML = symbols.split('').map(char =>
    symbolMap[char.toLowerCase() as keyof typeof symbolMap] || char === '\n'
      ? char === '\n' ? '<br>' : `<span class="symbol">${char}</span>`
      : char
  ).join('');

  // Animate reveal
  setTimeout(() => {
    const symbolElements = display.querySelectorAll<HTMLElement>('.symbol');
    let delay = 0;

    symbolElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('highlight');
        setTimeout(() => el.classList.remove('highlight'), 300);
      }, delay);
      delay += 30;
    });

    // Show nav after animation
    setTimeout(() => {
      nav.classList.add('visible');
      explanation.style.display = 'block';
    }, delay + 500);
  }, 500);
}

// Create Tab
function initCreateTab() {
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const companyInput = document.getElementById('company') as HTMLInputElement;
  const websiteInput = document.getElementById('website') as HTMLInputElement;

  const outputContainer = document.getElementById('create-output')!;
  const outputBox = document.getElementById('encoded-signature')!;

  const copyBtn = document.getElementById('copy-btn')!;
  const emailBtn = document.getElementById('email-btn')!;
  const downloadTxtBtn = document.getElementById('download-txt-btn')!;
  const downloadHtmlBtn = document.getElementById('download-html-btn')!;

  function updateSignature() {
    const input: SignatureInput = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      company: companyInput.value.trim(),
      website: websiteInput.value.trim(),
    };

    const validation = validateInputForAction(input);

    if (!validation.valid) {
      outputContainer.style.display = 'none';
      return;
    }

    const signature = generateArcanaSignature(input);
    outputBox.textContent = signature;
    outputContainer.style.display = 'block';
  }

  // Real-time updates
  [nameInput, emailInput, companyInput, websiteInput].forEach(input => {
    input.addEventListener('input', updateSignature);
  });

  // Copy button
  copyBtn.addEventListener('click', async () => {
    const text = outputBox.textContent || '';
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
  });

  // Email button
  emailBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const subject = encodeURIComponent('My Arcana Signature');
    const body = encodeURIComponent(outputBox.textContent || '');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });

  // Download .txt
  downloadTxtBtn.addEventListener('click', () => {
    const text = outputBox.textContent || '';
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arcana-signature.txt';
    a.click();
    URL.revokeObjectURL(url);
  });

  // Download HTML template
  downloadHtmlBtn.addEventListener('click', () => {
    const signature = outputBox.textContent || '';
    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body>
    <div style="font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.6;">
        <pre style="margin: 0;">${signature}</pre>
    </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'arcana-signature.html';
    a.click();
    URL.revokeObjectURL(url);
  });
}

// Decode Tab
function initDecodeTab() {
  const input = document.getElementById('decode-input') as HTMLTextAreaElement;
  const output = document.getElementById('decoded-output')!;
  const actions = document.getElementById('decode-actions')!;
  const copyBtn = document.getElementById('copy-decoded-btn')!;

  function updateDecode() {
    const symbols = input.value.trim().replace(/\s/g, '');

    if (symbols.length < 42) {
      output.style.display = 'none';
      actions.style.display = 'none';
      return;
    }

    const result = decodeSymbols(symbols);

    if (result.success && result.decoded) {
      output.textContent = result.decoded;
      output.style.display = 'block';
      actions.style.display = 'flex';
    } else {
      output.textContent = result.error || 'Decoding failed';
      output.style.display = 'block';
      actions.style.display = 'none';
    }
  }

  input.addEventListener('input', updateDecode);

  copyBtn.addEventListener('click', async () => {
    const text = output.textContent || '';
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = '✅ Copied!';
    setTimeout(() => copyBtn.textContent = '📋 Copy', 2000);
  });
}

// Demos Tab
let demo1: CharacterTransformation | null = null;
let demo2: HexPipeline | null = null;
let demo3: SymbolAssembly | null = null;

function initDemosTab() {
  const demo1Container = document.getElementById('demo1-container');
  const demo2Container = document.getElementById('demo2-container');
  const demo3Container = document.getElementById('demo3-container');
  const demo1Input = document.getElementById('demo1-input') as HTMLInputElement;
  const demo3Input = document.getElementById('demo3-input') as HTMLInputElement;

  if (!demo1Container || !demo2Container || !demo3Container) return;

  // Initialize demos when Demos tab is clicked
  const demosButton = document.querySelector('button[data-tab="demos"]');
  let demosInitialized = false;

  demosButton?.addEventListener('click', () => {
    if (demosInitialized) return;

    // Demo 1
    demo1 = new CharacterTransformation(demo1Container);
    demo1Input?.addEventListener('input', (e) => {
      demo1?.onTextInput((e.target as HTMLInputElement).value);
    });

    // Demo 2
    demo2 = new HexPipeline(demo2Container);

    // Demo 3
    demo3 = new SymbolAssembly(demo3Container);
    demo3Input?.addEventListener('input', (e) => {
      demo3?.onTextInput((e.target as HTMLInputElement).value);
    });

    demosInitialized = true;
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initTabNavigation();
  initHomeAnimation();
  initCreateTab();
  initDecodeTab();
  initDemosTab();
});
