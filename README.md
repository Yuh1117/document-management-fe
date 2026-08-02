# Document Management System (Frontend)

A modern Next.js frontend for a document management system. This repository contains the client application — UI, routes, components, and state management — used to interact with the DMS backend.

Key goals:

- Provide an intuitive interface for uploading, sharing, organizing, and managing documents.
- Support role & permission management, user admin pages, and an accessible client experience.

## System overview

This repository is one of three services that make up the DMS:

| Repository                             | Role                                                                                                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **document-management-be**             | Spring Boot REST API — auth, document/folder management, permissions, file storage, RabbitMQ publisher. Also owns the `docker-compose.yml` that runs the backing services. |
| **document-management-processor**      | Python/FastAPI — OCR, chunking, embeddings, Elasticsearch indexing, Gemini summarization, RabbitMQ worker                                                                  |
| **document-management-fe** (this repo) | Next.js 16 (App Router) frontend — UI, routing, admin panel, i18n                                                                                                          |

This app talks only to the backend. Search and AI summarization are served by the
processor but proxied through the backend, so there is no direct connection from
the browser to the processor.

## Quick start

Prerequisites

- Node.js 20+
- npm (or yarn / pnpm)

Install dependencies

```bash
npm install
```

Run in development mode

```bash
npm run dev
```

The dev server starts on port **5173** by default (`next dev -p 5173`).

Build for production

```bash
npm run build
```

Start production server

```bash
npm start
```

This also binds port **5173** (`next start -p 5173`).

Format / lint code

```bash
npm run format        # prettier --write
npm run format:check  # prettier --check
npm run lint:eslint   # eslint
```

## Environment

Create a `.env.local` file at the project root:

```env
# Backend API base URL (include protocol and path)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Google OAuth client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Local backend / integration

This repository contains the frontend only. For local development:

- Run the backend locally (default port `8080`) and set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api`.
- If the backend runs on a different port or path, update the env variable accordingly.
- Ensure CORS is enabled on the backend for the frontend origin.

## Tech stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Zustand** (client-side state management)
- **TanStack Query v5** (server-state / data fetching)
- **Tailwind CSS v4** (utility styling)
- **Radix UI + shadcn/ui** primitives for accessible components
- **React Hook Form + Zod** (form validation)
- **@react-oauth/google** (Google OAuth)
- **Sonner** for toast notifications
- **Axios** for HTTP requests
- **i18next / react-i18next** for localization (EN/VI)
- **next-themes** for light/dark theme switching
- **cmdk** for the command palette / search UI
- **Lucide React** + **React Icons** for icons
- **react-markdown + remark-gfm** for rendering AI-generated summaries
- **docx-preview** for Word document rendering
- **xlsx** for spreadsheet handling

## Project structure

```
app/                    # Next.js App Router pages (routing only)
  layout.tsx            # Root layout
  providers.tsx         # Client-side providers (Query, theme, i18n)
  icon.svg              # Favicon — auto-linked by Next.js, adapts to light/dark
  page.tsx              # Landing / home page
  login/                # Auth pages
  signup/
  admin/                # Admin section
    layout.tsx
    page.tsx
    users/
    roles/
    permissions/
    settings/
    summary-feedback/
  (main)/               # Client (end-user) section

components/
  ui/                   # shadcn/ui primitives (Button, Dialog, etc.)

features/               # All feature logic lives here
  shared/               # Cross-feature shared code
    components/
      layout/           # AppSidebar, Header, MainLayout, NavMain, Search
      settings/         # ThemeToggle, ChangeLanguage, SettingButton, ThemeProvider
      LoadingScreen.tsx
    hooks/
      useMobile.ts
      useQueryParams.ts
  admin/
    components/         # Admin pages and sub-components
  auth/
    components/         # Login, Signup, ProtectedRoute, etc.
  files/
    components/         # File/folder/document components
    hooks/              # useFilesLoader, useMultiSelect, useDownloadFiles
  landing/
    components/         # Landing page

store/                  # Zustand stores
  authStore.ts
  documentStore.ts
  filesStore.ts
  folderStore.ts
  permissionStore.ts
lib/                    # Utilities and API clients
  api.ts                # Axios client (client-side)
  serverApi.ts          # Server-side API helper
  i18n.tsx              # i18next setup
constants/              # App-wide constants (e.g. permissions)
types/                  # Shared TypeScript type definitions
public/                 # Static assets served verbatim at /
  react.svg             # Header logo
  locales/en/           # English translations
  locales/vi/           # Vietnamese translations
```

## Localization

The app uses `i18next` and includes `public/locales/` with `en` and `vi` translation files. Add or edit translations there to update UI text.

## Docker

A production Dockerfile is provided (`Dockerfile.prod`) along with an nginx config (`nginx.prod.conf`) for serving the built app.

Note that the frontend is **not** part of the `docker-compose.yml` in the backend
repository — that file covers the backend, processor, worker, and their
infrastructure only. Run this app separately with `npm run dev` or its own image.
`docker-compose.prod.yml` has a `frontend` service, but it is commented out and
still references stale `VITE_*` build args from before the migration to Next.js.
