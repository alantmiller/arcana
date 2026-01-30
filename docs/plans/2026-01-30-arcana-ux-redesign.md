# Arcana UX Redesign - Interactive Three.js Experience

**Date**: 2026-01-30
**Status**: Approved for implementation

## Overview

Redesign arcana.alantmiller.com to create an engaging, educational experience that guides users from curiosity (seeing symbols in email) to creation (making their own encoded signature). Features Three.js visualizations, tabbed navigation, and comprehensive signature creation toolkit.

## User Journey

1. **Curiosity** - See email signature with geometric symbols, click link
2. **Discovery** - Landing animation deconstructs the signature, reveals how it works
3. **Exploration** - Navigate tabs to see demos, understand encoding
4. **Creation** - Build own signature with full toolkit (copy, download, templates)
5. **Attribution** - GitHub link embedded, MIT licensed, encourages sharing

## Architecture

### Navigation Structure

**5 Tabs (sticky nav after landing animation):**
1. **Home** - Signature deconstruction + explanation
2. **Demos** - Three Three.js encoding visualizations
3. **Create** - Build your own signature
4. **Decode** - Interactive real-time decoder
5. **GitHub** - Repo link, MIT license, documentation

## Detailed Design

### Home Tab

**Landing Animation (Three.js):**
Duration: 5-8 seconds, full-screen on first visit

**Sequence:**
1. Encoded signature appears (the symbols from email)
2. Symbols break apart, float in 3D space (exploded view)
3. Each symbol highlights and shows its hex value
4. Symbols flow/morph into plaintext side-by-side
5. Text revealed: "Alan T Miller | Scatterworks | alan@scatterworks.xyz | https://github.com/alantmiller/arcana"
6. Legend appears showing symbol-to-hex mapping (all 16 symbols)
7. Sticky nav slides in from top

**How It Works Section (below animation):**
- Brief explanation of text → hex → symbols encoding
- Visual diagram showing the process
- "Try the demos" CTA button
- "Create your own" CTA button

### Demos Tab

**Layout:** Three demo cards (horizontal on desktop, stacked on mobile)

**Demo 1: Character Transformation**
- **Concept**: Type text, watch characters float up and morph into symbols
- **Interaction**: Text input field at bottom
- **Visualization**:
  - Characters become 3D objects
  - Morph stages: Letter → Byte → Hex → Symbol
  - Particle-like motion, smooth animations
  - Symbols arrange in formation
- **Real-time**: Every keystroke triggers transformations
- **Controls**: Reset, Info (explains what's happening)

**Demo 2: Hex Pipeline**
- **Concept**: Encoding as 3D assembly line
- **Visualization**:
  - Stage 1 (blue): Text cubes flow in
  - Stage 2 (orange): Convert to hex cylinders
  - Stage 3 (purple): Output as symbol shapes
  - Camera rotates to show pipeline from angles
- **Interaction**: Type text, watch flow through pipeline
- **Controls**: Reset, Rotate camera, Info

**Demo 3: Symbol Assembly**
- **Concept**: Symbols as building blocks constructing the output
- **Visualization**:
  - All 16 symbols float in 3D space like a toolbox
  - User types text
  - Needed symbols fly in, assemble into encoded output
  - Symbols glow when selected, dim when unused
  - Choreographed assembly animation
- **Interaction**: Type text, watch symbols construct message
- **Controls**: Reset, Info

### Create Tab

**Form Fields:**
- **Name** (required, min 3 chars)
- **Email** (required, validated)
- **Company** (optional)
- **Website** (optional)

**Real-time Preview:**
- Encoded signature appears as user types
- Live character count
- Visual preview with line wrapping (60 chars)

**Hidden Embedding:**
- GitHub URL automatically added to all signatures
- `https://github.com/alantmiller/arcana` appended to message before encoding
- MIT license attribution preserved

**Output Toolkit (appears when valid input):**

1. **Copy to Clipboard** - One-click copy of encoded signature
2. **Email to Myself** - Opens mailto with signature in body
3. **Download Text** - .txt file with encoded signature
4. **Download HTML Template** - Email signature HTML ready to paste into email client
5. **Setup Instructions** - Expandable panels for:
   - Gmail (how to add signature)
   - Outlook (desktop & web)
   - Apple Mail
   - Other clients (generic instructions)

**HTML Template Format:**
```html
<div style="font-family: 'Courier New', monospace; font-size: 12px;">
  [User's plaintext info]

  [Encoded symbols, line-wrapped]
</div>
```

### Decode Tab

**Interactive Decoder:**

**Input:**
- Large text area (textarea, 6+ rows)
- Placeholder: "Paste geometric symbols here..."
- Min 42 characters validation

**Real-time Decoding:**
- No decode button - decodes as user types/pastes
- Instant feedback
- Error messages for invalid input (too short, invalid symbols, odd hex length)

**Visual Feedback:**
- Hover over symbols shows hex value in tooltip
- Click symbol highlights it and shows hex value persistently

**Breakdown Panel:**
- Shows decoding stages:
  - Symbols (with hex tooltips)
  - Hex string
  - Bytes
  - Decoded text
- Toggle to show/hide intermediate stages

**Output:**
- Decoded message displayed in readable format
- Copy decoded text button
- Email decoded text button

### GitHub Tab

**Content:**
- Link to repository: https://github.com/alantmiller/arcana
- MIT License badge and text
- Brief explanation of open-source nature
- "Fork it, use it, share it" messaging
- Link to README documentation
- Contributor guidelines (if applicable)

## Visual Design System

### Aesthetic: Geometric Modern

**Color Palette:**
- **Background**: Mid-tone (#3a3a52 or similar dark blue-gray)
- **Primary**: Purple (#8b5cf6) - from symbol set
- **Secondary**: Cyan (#06b6d4) - from symbol set
- **Accent**: Orange (#f97316) - for highlights
- **Text**: White (#ffffff) on dark, Dark gray (#1f2937) on light
- **Surfaces**: Slightly lighter than background (#4a4a62)

**Typography:**
- **Headings**: Contemporary sans-serif (Inter, Poppins, or DM Sans)
- **Body**: Same sans-serif for readability
- **Code/Symbols**: 'Courier New', monospace (consistent with original)
- **Size scale**: 14px base, 1.25 ratio

**Spacing:**
- 8px base unit
- Generous whitespace (modern, not cramped)
- Card padding: 24px-32px
- Section spacing: 64px-96px

**Geometric Elements:**
- Symbol shapes (□, ■, ◇, ○, △, etc.) as decorative elements
- Scattered in background (low opacity, large scale)
- Used as section dividers or bullets
- Animate subtly on scroll/hover

**Components:**
- Rounded corners (8px standard, 12px for cards)
- Smooth shadows (subtle depth)
- Transitions: 200-300ms ease-in-out
- Hover states: subtle scale/glow effects

**Responsive:**
- Mobile-first approach
- Tabs collapse to dropdown on mobile
- Three.js demos scale down gracefully
- Touch-friendly tap targets (44px min)

## Technical Requirements

### Three.js Implementation

**Performance:**
- Lazy load Three.js (only when Demos tab accessed)
- RequestAnimationFrame for smooth 60fps
- Reduce particles/complexity on mobile
- Pause animations when tab not visible

**Camera:**
- OrbitControls for demos (optional user control)
- Smooth auto-rotation on idle
- Responsive to window resize

**Symbols as 3D Objects:**
- Use THREE.TextGeometry or THREE.ShapeGeometry
- Cache geometries (don't recreate per frame)
- Materials: MeshStandardMaterial with subtle emission

### Build System

**Stack:**
- Deno + TypeScript (existing)
- Vite for bundling
- Three.js via npm specifier
- No additional frameworks (vanilla TS)

**Code Organization:**
```
src/
├── arcana.ts           # Core encoding logic (existing)
├── main.ts             # App initialization
├── components/
│   ├── Navigation.ts   # Tab navigation
│   ├── HomeTab.ts      # Landing animation + explainer
│   ├── DemosTab.ts     # Three.js demo launcher
│   ├── CreateTab.ts    # Signature creation form
│   ├── DecodeTab.ts    # Interactive decoder
│   └── GitHubTab.ts    # Repo info
├── demos/
│   ├── CharacterTransformation.ts
│   ├── HexPipeline.ts
│   └── SymbolAssembly.ts
├── utils/
│   ├── threejs-helpers.ts
│   └── email-template.ts
└── styles/
    └── theme.ts        # Color palette, spacing, etc.
```

### State Management

**Simple state object:**
- Current tab
- Animation completion status
- User signature data
- Demo interaction state

No complex framework needed - vanilla JS state management sufficient.

## Implementation Phases

### Phase 1: Navigation & Structure
- Set up tab navigation system
- Implement routing (hash-based or state-based)
- Create tab containers
- Mobile responsive layout

### Phase 2: Home Tab
- Three.js signature deconstruction animation
- Symbol exploded view
- Hex value highlights
- Symbol-to-hex legend
- "How It Works" content section

### Phase 3: Create Tab
- Form with validation
- Real-time encoding preview
- Copy/Email/Download buttons
- HTML template generation
- Email client instructions

### Phase 4: Decode Tab
- Real-time decoder
- Symbol hover tooltips
- Breakdown visualization
- Error handling

### Phase 5: Demos Tab
- Demo 1: Character Transformation
- Demo 2: Hex Pipeline
- Demo 3: Symbol Assembly
- Demo launcher UI

### Phase 6: Polish
- GitHub tab content
- Visual design refinement
- Animations/transitions
- Performance optimization
- Mobile testing

## Success Criteria

- [ ] Landing animation completes in 5-8 seconds, reveals encoding clearly
- [ ] All 3 demos run smoothly at 60fps on desktop, 30fps on mobile
- [ ] Real-time encoding works as user types (no lag)
- [ ] Real-time decoding works as user pastes (no lag)
- [ ] HTML email template works in Gmail, Outlook, Apple Mail
- [ ] Mobile experience is touch-friendly and performant
- [ ] GitHub URL embedded in all generated signatures
- [ ] All features accessible via keyboard navigation
- [ ] Site loads in under 3 seconds on 3G connection

## Future Enhancements

- Additional Three.js demos (Matrix cascade, VQ visualization)
- Multiple color themes (dark/light mode toggle)
- Export as PNG/SVG image of symbols
- Custom symbol sets (user-defined mappings)
- Share signature via social media
- QR code generation with embedded signature
- Analytics on signature creation (privacy-respecting)
