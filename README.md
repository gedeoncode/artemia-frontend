# Artemia Frontend

Artemia is a Next.js marketplace frontend for buyers, sellers, and administrators. It includes storefront and product discovery, authentication and registration, cart/checkout, seller tools, admin management, lead workflows, and MDX-based help documentation.

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS, Radix UI, Headless UI, and Lucide icons
- TanStack Query, Zustand, React Hook Form, and Zod
- MDX documentation

## Requirements

- Node.js 20.9 or newer
- npm (the repository includes `package-lock.json`)
- Access to the Artemia backend API

## Local development

```bash
npm ci
```

Create `.env.local` in the project root:

```dotenv
# Backend API origin; server-side requests use this value.
API_BASE_URL=https://artemia-backend-production.up.railway.app

# Optional public site label.
NEXT_PUBLIC_SITE_NAME=Artemia
```

Start the development server:

```bash
npm run dev
```

The development script binds Next.js to `artemia.local:3000`. Add this entry to your machine's hosts file if the hostname does not resolve:

```text
127.0.0.1 artemia.local
```

Alternatively, run `npm run dev:next -- --hostname 0.0.0.0` and open the appropriate local address. The documentation heading watcher is included in `npm run dev`; run `npm run dev:next` when you do not need it.

## Useful commands

```bash
npm run lint       # ESLint checks in src/
npm run build      # Production build
npm start          # Serve the production build
npm run clean      # Remove the .next build directory
npm run generate:headings
```

## Project layout

- `src/app/` — App Router pages, route groups, and API route handlers
- `src/domain/` — domain-oriented features and business-facing UI logic
- `src/components/` — shared and reusable UI components
- `src/lib/` — shared infrastructure, HTTP, and authentication utilities
- `src/config/` — application configuration
- `src/content/docs/` — MDX help and documentation content
- `src/styles/` — global styles
- `public/` — static assets

## Backend and authentication

The frontend communicates with the backend through the configured API origin. Authentication uses access/refresh-token cookies; protected page navigation checks for the refresh-token cookie in `src/proxy.ts`. This presence check is a navigation guard, not a substitute for authorization. The backend must validate tokens and enforce permissions on every protected operation.

Do not commit `.env.local`, credentials, tokens, or private API keys. Configure production environment variables in the deployment platform and use HTTPS for production traffic.

## Production release checklist

Before deploying, verify the production API URL and required backend services, test sign-in/registration and role-based access, and run linting plus a production build in CI. Review the current Next.js configuration: `typescript.ignoreBuildErrors` is enabled, so a successful build does **not** currently guarantee TypeScript correctness. Resolve the underlying type errors and disable that bypass before treating the release as production-ready. Also replace the local-development page metadata in `src/app/layout.tsx` with production-facing title and description.

## Notes

This repository is the frontend only. Backend persistence, API availability, deployment infrastructure, and production secrets are managed separately.
