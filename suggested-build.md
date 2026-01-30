### Recommended Project Structure (2025 best practices)

```
arcana/
├── public/                     # Static files served directly
│   ├── index.html              # Main entry point
│   └── favicon.ico             # (optional)
├── src/
│   ├── arcana.ts               # Core logic + types (pure functions)
│   ├── main.ts                 # DOM bindings, event listeners, side-effects
│   └── types.ts                # Shared type definitions (optional, can live in arcana.ts)
├── tests/
│   ├── arcana.test.ts          # Unit tests for pure logic
│   └── dom.test.ts             # Optional: integration tests with jsdom
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts              # Recommended build tool (Vite)
└── README.md
```

### Step-by-step setup instructions

#### 1. Create project folder & initialize

```bash
mkdir arcana && cd arcana
npm init -y
npm install --save-dev typescript vite @types/node vitest jsdom @testing-library/dom zod
npm install zod   # runtime validation (small footprint)
```

#### 2. Important files

**`package.json`** (essential parts)

```json
{
  "name": "arcana-signatures",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest watch",
    "test:ui": "vitest --ui"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vite": "^5.4.8",
    "vitest": "^2.1.3",
    "jsdom": "^25.0.1",
    "@testing-library/dom": "^10.4.0",
    "zod": "^3.23.8"
  }
}
```

**`vite.config.ts`** (recommended – simple & fast)

```ts
import { defineConfig } from 'vite';

export default defineConfig({
  root: 'public',
  publicDir: false,           // we don't have extra static assets
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: {
    open: true,
  },
});
```

**`tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "declaration": true,
    "isolatedModules": true,
    "noEmitOnError": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### 3. File contents summary (where to put what)

| File                   | Purpose                                             | Already provided?             |
| ---------------------- | --------------------------------------------------- | ----------------------------- |
| `public/index.html`    | Main HTML page (the one with form, modal, styles)   | Yes                           |
| `src/arcana.ts`        | Pure business logic, types, encode/decode functions | Yes (latest)                  |
| `src/main.ts`          | DOM interaction, event listeners, glue code         | Extract from `<script>` block |
| `tests/arcana.test.ts` | Unit tests for core logic                           | Yes                           |
| `tests/dom.test.ts`    | Optional DOM/integration tests                      | Example provided              |
| `vite.config.ts`       | Build & dev server config                           | Above                         |

#### 4. Extract DOM code → `src/main.ts`

Take everything that was inside the `<script type="module">` block (the big `if (typeof document !== 'undefined')` part) and move it to `src/main.ts`.

```ts
// src/main.ts
import {
  generateArcanaSignature,
  validateInputForAction,
  decodeSymbols,
  performVQ,
  reverseSymbolMap,
  type SignatureInput
} from './arcana';

if (typeof document !== 'undefined') {
  // All your event listeners, updateOutput(), modal logic, etc.
  // ... paste the entire DOM manipulation code here ...
  // Make sure to use the imported functions
}
```

Then in `index.html` change the script tag to:

```html
<script type="module" src="/src/main.ts"></script>
```

(Vite will handle it during dev/build)

#### 5. Development workflow

```bash
# Start dev server (auto-reload, fast)
npm run dev

# Run tests in watch mode (recommended while developing)
npm run test:watch

# Build production version
npm run build

# Preview production build
npm run preview
```

#### 6. Deployment options (simple & free in 2025–2026)

- **GitHub Pages** (classic & zero-cost)
- **Vercel** (automatic deployments from GitHub, great DX)
- **Netlify** (drag & drop or Git integration)
- **Cloudflare Pages** (very fast, generous free tier)

All of them work excellently with Vite projects.

#### Quick checklist before first commit

- [ ] `public/index.html` exists and loads `src/main.ts`
- [ ] `src/arcana.ts` contains pure logic + types
- [ ] `src/main.ts` contains only side-effects / DOM code
- [ ] `tsconfig.json` is set to strict mode
- [ ] Tests pass (`npm test`)
- [ ] `npm run dev` works and updates signature in real time
- [ ] Decoder modal works and validates minimum length

If you follow this structure, your project will be:

- testable
- maintainable
- type-safe
- modern (2025–2026 standards)
- easy to extend (add themes, more symbol sets, export formats, etc.)
