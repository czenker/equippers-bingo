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
| `npm run build` | Type-check and build for production into `docs/` |
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

Provide at least 24 labels (the center tile is always a free space).

## Deployment (GitHub Pages)

The production build in `docs/` is checked into the repository so it can be served directly by GitHub Pages.

### Initial setup

1. Go to your repository on GitHub: **Settings > Pages**
2. Under **Source**, select **Deploy from a branch**
3. Set branch to **main** and folder to **`/dist`**
4. Click **Save**

The site will be available at `https://<user>.github.io/equippers-bingo/`.

### Updating the deployed site

After making changes, rebuild and commit:

```bash
npm run build
git add docs/
git commit -m "rebuild for deployment"
git push
```

GitHub Pages will pick up the new files automatically.
