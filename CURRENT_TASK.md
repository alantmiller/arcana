# CURRENT TASK: Three.js Demos for Arcana

**Last Updated**: 2026-01-30
**Status**: Ready to implement Three.js visualizations
**Live Site**: https://arcana.alantmiller.com

## What's Done ✅

### Deployment
- Site live at arcana.alantmiller.com (Cloudflare Pages)
- Auto-deploys on push to master
- Build: Deno + Vite

### UI Complete
- 5-tab navigation (Home, Demos, Create, Decode, GitHub)
- Geometric modern design (#3a3a52 background, purple/cyan accents)
- Real-time signature creation (Name, Email, Company, Website)
- Real-time decoder (paste symbols, instant decode)
- Full toolkit: Copy, Email, Download .txt, Download HTML
- Responsive mobile design

### Code Structure
```
src/
  arcana.ts      # Core encoding/decoding (pure functions)
  main.ts        # Tab navigation, Create/Decode logic
public/
  index.html     # UI with geometric modern styling
```

## What's Next ⏭️

### Three.js Demos to Implement

**Location**: Demos tab (currently shows placeholder)

**3 Visualizations Required:**

#### 1. Character Transformation
- User types in input field
- Characters float up as 3D objects
- Morph: Letter → Byte → Hex → Symbol
- Particle-like motion, smooth transitions
- Real-time on every keystroke

#### 2. Hex Pipeline
- 3D assembly line showing encoding stages
- Stage 1 (blue): Text cubes
- Stage 2 (orange): Hex cylinders
- Stage 3 (purple): Symbol shapes
- Camera can rotate to view from angles

#### 3. Symbol Assembly
- 16 geometric symbols float in 3D space
- User types, needed symbols fly in and assemble
- Symbols glow when selected, dim when unused
- Choreographed construction animation

### Implementation Steps

1. **Add Three.js dependency** to deno.json imports
2. **Create** `src/demos/` directory
3. **Implement each demo** as separate module:
   - `CharacterTransformation.ts`
   - `HexPipeline.ts`
   - `SymbolAssembly.ts`
4. **Update Demos tab** in main.ts to load and initialize
5. **Lazy load** Three.js (only when Demos tab clicked)
6. **Test performance** (60fps desktop, 30fps mobile)
7. **Commit and push** to deploy

### Key Technical Details

**Three.js Setup:**
```typescript
import * as THREE from 'npm:three@^0.160.0';
import { OrbitControls } from 'npm:three@^0.160.0/examples/jsm/controls/OrbitControls.js';
```

**Symbol Map for 3D:**
```typescript
symbolMap = {
  '0': '□', '1': '■', '2': '◇', '3': '◆',
  '4': '○', '5': '●', '6': '△', '7': '▲',
  '8': '▽', '9': '▼', 'a': '◻', 'b': '◼',
  'c': '◯', 'd': '★', 'e': '☆', 'f': '◎'
};
```

**Performance Requirements:**
- RequestAnimationFrame for smooth 60fps
- Reduce complexity on mobile detection
- Pause when tab not visible
- Cache geometries (don't recreate per frame)

### Visual Aesthetic
- Background: #3a3a52 (matches site)
- Accent colors: Purple #8b5cf6, Cyan #06b6d4, Orange #f97316
- Materials: MeshStandardMaterial with subtle emission
- Lighting: Ambient + point lights for depth

## Quick Start Commands

```bash
cd /workbench/@projects/@arcana

# Dev server
deno task dev

# Run tests
deno task test

# Build
deno task build

# Deploy (auto via git push)
git add -A && git commit -m "feat: Add Three.js demos" && git push
```

## Context for Next Session

**Design doc**: `docs/plans/2026-01-30-arcana-ux-redesign.md`

**User's vision**: "Wow them with cool Three.js demo" - multiple visualizations showing encoding process from different angles. Each demo should be interactive, educational, and visually striking.

**DO NOT**:
- Re-plan or re-design (design is final)
- Create worktrees or complex setup
- Waste tokens on process - just implement

**DO**:
- Read this file first
- Implement the 3 demos directly
- Test each one works
- Commit and push

## Files to Modify

1. **deno.json** - Add Three.js to imports
2. **public/index.html** - Update Demos tab HTML structure
3. **src/main.ts** - Add demo initialization logic
4. **Create**: `src/demos/CharacterTransformation.ts`
5. **Create**: `src/demos/HexPipeline.ts`
6. **Create**: `src/demos/SymbolAssembly.ts`

## Success Criteria

- [ ] All 3 demos render and animate smoothly
- [ ] User can type/interact with each demo
- [ ] Demos match the geometric modern aesthetic
- [ ] Mobile-responsive (scaled down complexity)
- [ ] Deployed to arcana.alantmiller.com
- [ ] No console errors

**WHEN STARTING NEXT SESSION**: Read this file, then immediately start implementing. No planning, no questions - just build the demos.
