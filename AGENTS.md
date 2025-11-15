# Repository Guidelines

## Project Structure & Module Organization
The Vite-powered React client lives in `src/`. Use `components/` for reusable UI, `pages/` for routed views, `store/` and `store/slices/` for Redux Toolkit state, `util/` for helpers like `rest.ts` and `socket.ts`, and `assets/` for profile art. Static files in `public/` are copied as-is, and production bundles land in `dist/`. Top-level configs (`vite.config.ts`, `tsconfig*.json`, `Dockerfile`) define tooling.

## Build, Test, and Development Commands
- `npm install` — install dependencies; rerun after updating `package.json`.
- `npm run dev` — start the Vite dev server on all interfaces for local testing of WebSocket flows.
- `npm run build` — generate `dist/` by running `tsc` type checks and the production bundler.
- `npm run preview` — serve the latest build for smoke testing.
- `npm run lint` — enforce ESLint rules (`.ts`/`.tsx`) with zero-warning tolerance.

## Coding Style & Naming Conventions
Follow the existing two-space indentation and TypeScript-first patterns in `src/`. Components, contexts, and slices use PascalCase filenames (e.g., `NewConversation.tsx`); functions and variables stay camelCase. Keep styled-components close to consumers and trim unused CSS. Order imports React → third-party → internal, prefer named exports, and run `npm run lint` before committing to satisfy the shared ESLint + `@typescript-eslint` ruleset.

## Testing Guidelines
Automated UI tests are not yet wired. When adding behavior, include component-level coverage with Vitest + React Testing Library in `src/__tests__` or as `*.test.tsx`, and describe manual checks in the PR. Until a test runner lands, gate changes with `npm run lint` and focused manual flows (auth, new conversation, live updates).

## Commit & Pull Request Guidelines
Commits in this repo are short, imperative, and lower-case (e.g., `add logout reducers`). Keep subjects under ~60 characters and group related changes together. PRs should include a concise summary, linked issue, screenshots or GIFs for UI adjustments, a checklist of commands run (`npm run lint`, manual scenarios), and any config notes. Request review once linting passes and the branch rebases cleanly onto `main`.

## Configuration Tips
Set `VITE_API_BASE_URL` in a `.env.local` file to target the desired API host; both the Axios client and WebSocket helper read this value. Avoid committing secrets, and confirm that refreshed tokens from `/auth/refresh` are handled through the Redux store before merging.
