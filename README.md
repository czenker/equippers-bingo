# Equippers Bingo

Interactive bingo card that runs entirely in the browser. Click tiles to mark them — complete a row, column, or diagonal to win.

## Prerequisites

- Node.js >= 18

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (default: http://localhost:5173).

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with hot reload |
| `npm run build` | Type-check and build for production into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Customising labels

Edit `public/labels.json` to change the default bingo tile texts:

```json
{
  "labels": [
    "Arrived late",
    "Forgot mute",
    "..."
  ]
}
```

Provide at least 24 labels (the center tile is always a free space). Labels can also be edited at runtime by clicking **Edit Labels** in the app.
