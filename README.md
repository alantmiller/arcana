# Arcana

AI-inspired signature encoding tool that converts text into geometric symbols using hex encoding with a vector quantization-inspired mapping.

## Features

- **Real-time Encoding**: Live signature updates as you type
- **Geometric Symbols**: 16-symbol alphabet (squares, circles, triangles)
- **Decoder**: Reverse symbols back to original text
- **Email Compatible**: Output wrapped at 60 characters
- **Copy to Clipboard**: One-click copy functionality
- **Vector Quantization Demo**: Educational VQ visualization

## Development

### Prerequisites

- [Deno](https://deno.land/) 2.x or later

### Setup

```bash
# Clone the repository
git clone https://github.com/alantmiller/arcana.git
cd arcana

# Start development server
deno task dev

# Run tests
deno task test

# Run tests in watch mode
deno task test:watch
```

### Build for Production

```bash
# Build static assets
deno task build

# Preview production build
deno task preview
```

The built files will be in the `dist/` directory.

## Project Structure

```
arcana/
├── src/
│   ├── arcana.ts       # Core encoding/decoding logic
│   └── main.ts         # DOM bindings and event handlers
├── public/
│   └── index.html      # HTML structure and styles
├── tests/
│   └── arcana.test.ts  # Unit tests
├── deno.json           # Deno configuration and tasks
├── vite.config.ts      # Vite build configuration
└── README.md
```

## Deployment

This project is deployed to [arcana.alantmiller.com](https://arcana.alantmiller.com) using Cloudflare Pages with automatic deployments from the main branch.

## How It Works

1. **Encoding**: Text → UTF-8 bytes → Hex string → Geometric symbols
2. **Decoding**: Symbols → Hex string → UTF-8 bytes → Original text
3. **Symbol Mapping**: Each hex digit (0-f) maps to a unique geometric symbol

## License

MIT
