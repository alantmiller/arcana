# Arcana Deno + Cloudflare Pages Deployment Design

**Date**: 2026-01-28
**Status**: Approved for implementation

## Overview

Deploy the Arcana signature encoding tool to `https://arcana.alantmiller.com` using Deno/TypeScript development with Cloudflare Pages hosting and automated DNS management.

## Architecture

**Deployment Pipeline:**
```
Local Dev (Deno) → Git Push → GitHub Repo → Cloudflare Pages (auto-deploy) → arcana.alantmiller.com
```

**Key Components:**
1. **Source Code**: Deno/TypeScript at repo root
2. **Build Tool**: Vite (via npm specifier)
3. **Repository**: GitHub (`alantmiller/arcana`)
4. **Hosting**: Cloudflare Pages (free tier)
5. **DNS**: Cloudflare DNS CNAME record

## Project Structure

```
arcana/                              # Repo root
├── .github/
│   └── workflows/
│       └── deploy.yml               # Optional: CI checks
├── src/
│   ├── arcana.ts                    # Core encode/decode logic
│   ├── main.ts                      # DOM bindings, event listeners
│   └── types.ts                     # TypeScript interfaces (optional)
├── public/
│   └── index.html                   # HTML structure + styles
├── tests/
│   └── arcana.test.ts               # Deno.test() unit tests
├── deno.json                        # Tasks, imports, compiler options
├── vite.config.ts                   # Build configuration
├── .gitignore
└── README.md
```

## Technology Stack

- **Runtime**: Deno 2.x
- **Language**: TypeScript (strict mode)
- **Build Tool**: Vite 5.x (via npm specifier)
- **Testing**: Deno built-in test runner
- **CSS**: Inline in HTML (single-file simplicity)

### deno.json Configuration

```json
{
  "tasks": {
    "dev": "deno run -A npm:vite",
    "build": "deno run -A npm:vite build",
    "preview": "deno run -A npm:vite preview",
    "test": "deno test --allow-read",
    "test:watch": "deno test --watch --allow-read"
  },
  "imports": {
    "vite": "npm:vite@^5.4"
  },
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "deno.ns"],
    "strict": true
  }
}
```

## Code Migration Strategy

**Source**: Root `index.html` (374 lines, fully functional)

### 1. Core Logic → `src/arcana.ts`
- Symbol maps: `symbolMap`, `reverseSymbolMap`
- `generateSignature()` - text → hex → symbols
- `decodeSymbols()` - symbols → hex → text
- `performVQ()` - vector quantization demo
- `validateForAction()` - input validation rules
- TypeScript interfaces

### 2. DOM Bindings → `src/main.ts`
- `updateOutput()` - real-time signature updates
- Event listeners for form inputs
- Modal open/close logic
- Copy-to-clipboard handlers
- Email `mailto:` link generation
- Import and use functions from `arcana.ts`

### 3. HTML Structure → `public/index.html`
- Form markup
- Output display area
- Decoder modal structure
- Inline `<style>` block
- `<script type="module" src="/src/main.ts"></script>`

### 4. Tests → `tests/arcana.test.ts`
- Encode/decode round-trip
- Validation rules
- Hidden GitHub URL injection
- Symbol mapping bidirectionality

## Deployment Configuration

### Cloudflare Pages Build Settings
- **Framework preset**: Vite
- **Build command**: `deno run -A npm:vite build`
- **Build output directory**: `dist`
- **Root directory**: `/`
- **Environment variables**: None needed

### DNS Configuration
- **Type**: CNAME
- **Name**: `arcana`
- **Target**: `[cloudflare-pages-project].pages.dev`
- **Proxy**: Enabled (orange cloud)
- **SSL/TLS**: Full (strict)

## Implementation Phases

### Phase 1: Project Setup (15-20 min)
- Create fresh project structure at repo root
- Write configuration files
- Create `.gitignore` and `README.md`

### Phase 2: Code Migration (30-45 min)
- Extract logic to `src/arcana.ts`
- Extract DOM code to `src/main.ts`
- Move HTML to `public/index.html`
- Verify local functionality

### Phase 3: Testing (15-20 min)
- Write unit tests
- Run test suite
- Manual feature testing

### Phase 4: GitHub Setup (5-10 min)
- Create repository
- Initial commit and push

### Phase 5: Cloudflare Deployment (10-15 min)
- Connect repo to Cloudflare Pages
- Configure build settings
- Add DNS CNAME record
- Verify deployment

**Total Estimated Time**: 75-110 minutes

## Success Criteria

- [ ] `https://arcana.alantmiller.com` serves the Arcana app
- [ ] All encoding/decoding features work correctly
- [ ] Copy and email functions operational
- [ ] Auto-deployment on git push to main
- [ ] SSL certificate provisioned automatically
- [ ] Unit tests passing

## Future Enhancements

- Extract CSS to separate file
- Add themes/color schemes
- Export formats (PNG, SVG)
- Multiple symbol sets
- Server-side features (if needed)
