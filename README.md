# Minesweeper

A [Minesweeper](<https://en.wikipedia.org/wiki/Minesweeper_(video_game)>) game
built with React, TypeScript, Vite, and Material UI.

Requires Node.js 22.18 or newer.

**Live site:** <https://itshinmo.github.io/react-mine-sweeper/>

## How to play

- **Left click** a hidden cell to reveal it.
- **Right click** a hidden cell to place or remove a flag.
- Reveal every cell that does not contain a mine to win.
- Revealing a mine loses the game and reveals all remaining mines.
- The board is 9×9 with 10 mines.
- The timer starts with the first revealed cell and caps at 999 seconds.

## Scripts

```bash
yarn install       # install dependencies
yarn dev           # start the Vite development server
yarn test          # run the unit tests once
yarn test:watch    # run the unit tests in watch mode
yarn lint          # run ESLint
yarn typecheck     # run the TypeScript compiler
yarn build         # create a production build in dist/
yarn preview       # preview the production build
yarn format        # format the repository with Prettier
```

## Architecture

The game logic is separated from the React UI:

- `src/game/` contains the pure, dependency-free Minesweeper engine:
  - `board.ts` creates boards, reveals cells, toggles flags, and detects wins.
  - `game.ts` is the pure reducer for the game status and timer.
  - `format-counter.ts` formats the three-digit mine and timer displays.
- `src/hooks/use-minesweeper.ts` connects the reducer to React and runs the
  timer.
- `src/components/` contains the presentational components.
- `src/assets/` contains the SVG icons.

The engine is fully unit tested with Node's built-in test runner. Node 22.18+
is required to run the TypeScript test files directly.

## Deployment

Every push to `main` (including merges) runs the
[`Deploy to GitHub Pages`](.github/workflows/deploy.yml) workflow. It installs
dependencies, lints, tests, builds the project, and publishes `dist/` to GitHub
Pages.

The Pages source must be set to **GitHub Actions** in the repository settings
(Settings → Pages → Build and deployment → Source).
