# Rommel Vincent Monterde - Portfolio Website

A modern, minimalist portfolio website built with Next.js, featuring interactive 3D elements and smooth animations.

## Tech Stack

- **Framework:** Next.js 16
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **3D Graphics:** React Three Fiber + Three.js
- **Typography:** Atkinson Hyperlegible, Outfit, Geist Mono
- **Analytics:** Vercel Analytics
- **Scheduling:** Calendly Integration

## Features

- Interactive 3D rotating cube with audio visualizer effect
- Smooth scroll animations with viewport triggers
- Responsive design with mobile navigation
- Case study showcases with custom visualizations
- Contact form with Elfsight integration
- Calendly scheduling widget

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

```
├── app/
│   ├── globals.css       # Global styles and CSS variables
│   ├── layout.tsx        # Root layout with fonts and scripts
│   ├── page.tsx          # Home page (server component)
│   └── PortfolioClient.tsx  # Main portfolio content
├── components/
│   ├── navbar.tsx        # Navigation with mobile menu
│   ├── rotating-cube.tsx # 3D rotating cube component
│   └── case-studies.tsx  # Case study visualizations
├── public/
│   └── images/           # Static assets
└── lib/
    └── utils.ts          # Utility functions
```

## Design

- **Color Palette:** Monochromatic with light gray (#e4e4e4) and dark (#1e1e1e)
- **Typography:** Clean, bold uppercase headings with readable body text
- **Layout:** Grid-based responsive design

## 📄 License

© 2025 Rommel Vincent Monterde. All rights reserved.


