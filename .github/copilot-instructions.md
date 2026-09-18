# Copilot instructions for MahePDFCV

## Build, test, and lint

This repo is a small Next.js app and does not define a dedicated lint script or test suite in `package.json`.

Use these commands as the primary workflow:

- Install dependencies: `npm install`
- Run the app locally: `npm run dev`
- Create a production build: `npm run build`
- Serve the production build locally: `npm run start`

There are no test files or test scripts configured in the project right now, so there is no single-test command to run. For validation after a code change, prefer `npm run build`.

## High-level architecture

This is a Next.js App Router app focused on serving a personal CV as a PDF.

- `app/page.tsx` is the landing page. It renders a simple shell and loads the PDF viewer.
- `components/PDFViewer.tsx` is the browser-only PDF viewer. It uses `pdfjs-dist` to load `/cv.pdf`, render every page into canvases, and expose the download button.
- `public/cv.pdf` is the static CV file served directly to the browser.
- `app/api/download-cv/route.ts` is the protected download endpoint. It validates a token, optionally reads browser geolocation, reverse-geocodes the coordinates through Nominatim, sends a Telegram notification, and streams the PDF file to the user.
- `next.config.js` exposes `NEXT_PUBLIC_CV_DOWNLOAD_TOKEN` from `CV_DOWNLOAD_TOKEN` and loads the PDF worker asset correctly.
- `vercel.json` contains the deployment rewrite configuration for Vercel.

The app is intentionally simple: no database, no API layer beyond this route, and no state management beyond the browser UI and env-driven integrations.

## Key conventions

- Keep PDF logic browser-side. `PDFViewer` is dynamically imported with `ssr: false` because `pdfjs-dist` relies on browser APIs and should not run during server-side rendering.
- Treat `/public/cv.pdf` and `/api/download-cv` as a paired contract. Changing one without updating the other will break the viewer/download flow.
- The protected download route expects the following environment variables:
  - `CV_DOWNLOAD_TOKEN` for the server-side token check
  - `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` for notification delivery
  - `NEXT_PUBLIC_CV_DOWNLOAD_TOKEN` is derived from `CV_DOWNLOAD_TOKEN` in `next.config.js`
- Styling uses Tailwind utility classes; keep changes consistent with the existing layout and design rather than introducing new component libraries or CSS frameworks.
- The download endpoint expects query params in the form `?token=...` and optionally `lat` / `lng`. If you change the request contract, update both the client and the route together.
- Deployment is minimalist and Vercel-oriented, so keep configuration changes small and aligned with the existing `vercel.json` and Next.js setup.
