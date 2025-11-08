# Document Management System (Frontend)

A modern React + Vite frontend for a document management system. This repository contains the client application (UI, routes, components and state management) used to interact with the DMS backend.

Key goals:
- Provide an intuitive interface for uploading, sharing, organizing and managing documents.
- Support role & permission management, user admin pages, and an accessible, accessible client experience.

## Quick start

Prerequisites
- Node.js (v16+ recommended)
- A package manager: npm, yarn or pnpm

Install dependencies (pick one)

```bash
# npm
npm install

# or yarn
yarn install

# or pnpm
pnpm install
```

Run in development mode (Vite)

```bash
npm run dev
```

Build for production

```bash
npm run build
```

Preview production build locally

```bash
npm run preview
```

Lint code

```bash
npm run lint
```

## Environment

```env
# Backend API base URL (include protocol and path if needed)
VITE_API_BASE_URL=http://localhost:8080/api

# Google OAuth client id (if used)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Local backend / integration

This repository contains the frontend only. For local development:

- Run the backend locally (default port often `8080`) and set `VITE_API_BASE_URL=http://localhost:8080/api`.
- If the backend uses a different port/path, update `VITE_API_BASE_URL` accordingly.
- Ensure CORS is enabled on the backend for the FE origin, or configure a dev proxy in `vite.config.ts`.

## Available scripts

Scripts are defined in `package.json`:

- `dev` — start the Vite dev server
- `build` — TypeScript project build (`tsc -b`) and Vite production build
- `preview` — preview the built production bundle
- `lint` — run ESLint across the repository

If `npm run build` fails due to TypeScript errors, run the TypeScript build directly to see errors:

```bash
npx tsc -b --verbose
```

## Tech stack

- React 19
- Vite 7
- TypeScript
- Redux Toolkit (state management)
- React Router (routing)
- Tailwind CSS v4 (utility styling)
- Radix UI + shadcn/ui primitives for accessible components
- Sonner for toast notifications
- Axios for HTTP requests
- i18next / react-i18next for localization

Note: confirm exact dependency versions in `package.json` — this README uses general names so it doesn't drift from the actual package versions.

## Project structure (high level)

Top-level `src/` contains the application code. Notable directories:

- `src/pages/` — top-level route pages (client + admin)
- `src/components/` — reusable UI components, organized by area (admin, client, ui, shared)
- `src/redux/` — Redux store, hooks and slices
- `src/hooks/` — custom React hooks
- `src/config/` — API clients and app-wide config
- `src/lib/` — small utilities
- `public/` — static assets and localized translation files

Because this app includes both admin and client views, files and folders are grouped by feature for clarity (roles, permissions, users, documents, folders, etc.).

## Localization

The app uses `i18next` and includes `public/locales/` with `en` and `vi` translation files. Add or edit translations there to update UI text.

## Quick verification (optional)

Check Node and package versions quickly:

```bash
node -v
npm -v
cat package.json | sed -n '1,200p'
```

## Notes

This README is intentionally conservative — it describes what to change locally and points developers to `package.json` for exact dependency versions. If you'd like, I can open `package.json` and align the README to exact versions (React/Vite/Tailwind) and add a `CONTRIBUTING.md` or CI notes.
