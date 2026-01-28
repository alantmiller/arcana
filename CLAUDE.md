# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Arcana** is a signature encoding tool that converts text into geometric symbols using hex encoding with a vector quantization-inspired mapping. The name comes from the Latin word for "secrets."

The project exists in two implementations:
1. **`arcana/`** - Node.js/pnpm/Vite implementation (structured but empty)
2. **`arcana-deno/`** - Deno implementation (React scaffold, minimal)
3. **`index.html`** - Single-file working implementation (374 lines, production-ready)

The working implementation is currently in the standalone `index.html` at the repository root.

## Core Architecture

### Symbol Mapping System

The encoding uses a 16-symbol alphabet mapped to hex digits:
- `'0': '□', '1': '■', '2': '◇', '3': '◆'` (squares)
- `'4': '○', '5': '●'` (circles)
- `'6': '△', '7': '▲', '8': '▽', '9': '▼'` (triangles)
- `'a': '◻', 'b': '◼', 'c': '◯', 'd': '★', 'e': '☆', 'f': '◎'` (special)

The `symbolMap` and `reverseSymbolMap` objects handle bidirectional conversion.

### Encoding Flow

1. **Input Collection** - Name, company, email, website (optional fields)
2. **Message Construction** - Fields joined with `|`, appends hidden GitHub URL
3. **Hex Encoding** - Text → UTF-8 bytes → hex string
4. **Symbol Mapping** - Each hex character → geometric symbol
5. **Line Wrapping** - Output wrapped at 60 characters for email compatibility

### Decoding Flow

1. **Symbol Input** - Minimum 42 characters required (validation)
2. **Reverse Mapping** - Symbols → hex string
3. **Hex Decoding** - Hex pairs → UTF-8 bytes → text
4. **Display** - Original message revealed

### Vector Quantization Demo

Simplified VQ demonstration:
- Characters → normalized values (ASCII/255)
- Values → quantized bins (4 levels)
- Bins → VQ symbols: `['≈', '∆', '≋', '∇']`

This is educational, not used in actual signature encoding.

## Development Commands

### Node.js/pnpm Version (arcana/)

```bash
cd arcana
pnpm install           # Install dependencies
pnpm dev               # Start Vite dev server
pnpm build             # Build for production (TypeScript + Vite)
pnpm preview           # Preview production build
pnpm test              # Run tests (Vitest)
pnpm test:watch        # Run tests in watch mode
pnpm test:ui           # Run tests with UI
```

**Note**: The `arcana/` directory structure exists but has no source files yet. See `suggested-build.md` for migration plan.

### Deno Version (arcana-deno/)

```bash
cd arcana-deno
deno task dev          # Start Vite dev server (React)
deno task build        # Build for production
deno task preview      # Preview production build
deno test              # Run Deno tests
```

**Note**: The Deno version is a React scaffold with minimal implementation.

### Standalone HTML (index.html)

```bash
# Serve locally with any static server
python -m http.server 8000
# or
npx serve .
# or
deno run --allow-net --allow-read https://deno.land/std/http/file_server.ts .
```

Then open `http://localhost:8000/index.html`

## Key Implementation Details

### Real-time Updates

All input fields have event listeners that trigger `updateOutput()` on every keystroke. No "Generate" button exists—signature updates live.

### Validation Strategy

- **No validation during typing** - User sees output immediately
- **Validation on actions** - Copy/email actions validate:
  - Name must be ≥3 characters
  - Email must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Hidden GitHub URL

Every signature includes `https://github.com/alantmiller/arcana` appended to the message before encoding. This is intentional and not visible in the input form.

### Modal Pattern

The Arcana Decoder uses a full-screen modal overlay:
- Opens via `#open-decoder` link
- Closes on X button, overlay click, or ESC key
- Contains decode input, output, copy, and email functions

## File Organization (Planned)

The `suggested-build.md` document describes the intended structure:

```
arcana/
├── public/
│   └── index.html          # Entry point (currently empty)
├── src/
│   ├── arcana.ts           # Core logic + types (planned)
│   ├── main.ts             # DOM bindings (planned)
│   └── types.ts            # Type definitions (optional)
├── tests/
│   ├── arcana.test.ts      # Unit tests (planned)
│   └── dom.test.ts         # Integration tests (optional)
└── vite.config.ts          # Vite configuration (exists)
```

**Current State**: Directories exist but are empty. All logic is in root `index.html`.

## Technology Stack

### Node.js Version (arcana/)
- **TypeScript** 5.6.3 - Type safety
- **Vite** 5.4.8 - Build tool and dev server
- **Vitest** 2.1.3 - Unit testing
- **jsdom** 25.0.1 - DOM testing environment
- **@testing-library/dom** 10.4.0 - DOM testing utilities
- **Zod** 3.23.8 - Runtime validation (devDep)

### Deno Version (arcana-deno/)
- **Deno** runtime - Modern JS/TS runtime
- **Vite** (via npm) - Build tool
- **React** 18 - UI framework
- **@deno/vite-plugin** - Deno/Vite integration

### Standalone Version (index.html)
- Vanilla JavaScript with TypeScript-style patterns
- No build step, no dependencies
- Browser-native APIs only

## Migration Path

To migrate the working `index.html` into the structured `arcana/` project:

1. Extract the `<script>` block (lines ~188-359) into `src/main.ts`
2. Extract core functions into `src/arcana.ts`:
   - `generateSignature()`
   - `validateForAction()`
   - `performVQ()`
   - Symbol maps
3. Move the HTML body into `public/index.html`
4. Extract and inline the CSS into a separate file or Vite's CSS handling
5. Update `public/index.html` to load `<script type="module" src="/src/main.ts">`

The `suggested-build.md` file contains detailed step-by-step instructions for this migration.

## Important Constraints

### Email Compatibility
- Output wrapped at 60 characters per line
- Some email clients may render symbols differently
- Signature includes plaintext header before symbols

### Minimum Decode Length
- Decoder requires minimum 42 characters
- This ensures meaningful messages (validates against accidental input)

### Character Encoding
- Uses UTF-8 TextEncoder/TextDecoder
- All input is hex-encoded before symbol mapping
- Non-ASCII characters are supported

## Testing Considerations

When implementing tests:
- Test symbol mapping bidirectionality (encode → decode should be identity)
- Test input validation rules (name length, email format)
- Test line wrapping at 60 characters
- Test hidden URL injection
- Test decode error handling (invalid length, invalid symbols, odd hex length)
- Test VQ demonstration separately (it's independent of signature encoding)

## Deployment Options

The standalone `index.html` can be deployed to:
- **GitHub Pages** - Zero-cost static hosting
- **Vercel** - Automatic deploys from Git
- **Netlify** - Drag-and-drop or Git integration
- **Cloudflare Pages** - Fast edge deployment

For the Vite-based versions, run `pnpm build` or `deno task build` and deploy the `dist/` folder.
