# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A lightweight colour manipulation tool website that converts between colour formats (RGB, HSL, RGBA, HSLA, HEX, etc.) with visual preview and copy-to-clipboard functionality. Deployed as a static site on Netlify.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Language**: TypeScript
- **Styling**: Plain CSS (component-scoped)
- **Colour Library**: culori (parsing and conversion)
- **Clipboard**: Native `navigator.clipboard` API

## Build & Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment

Static site hosted on Netlify. Builds automatically from main branch. Build output directory: `dist/`

## Architecture

This is a client-side only application with no backend. All colour conversion logic runs in the browser.

### Core Functionality
- **Colour Input**: Accept any valid colour format (HEX, RGB, RGBA, HSL, HSLA, named colours)
- **Colour Conversion**: Convert input to all supported output formats
- **Visual Preview**: Display the parsed colour as a swatch
- **Copy Buttons**: One-click copy for each format output

### Supported Colour Formats
- HEX (`#RGB`, `#RRGGBB`, `#RGBA`, `#RRGGBBAA`)
- RGB (`rgb(r, g, b)`)
- RGBA (`rgba(r, g, b, a)`)
- HSL (`hsl(h, s%, l%)`)
- HSLA (`hsla(h, s%, l%, a)`)
