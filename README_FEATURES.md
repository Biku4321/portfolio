
Feature upgrades included in this package (last_full.zip):

1) Analytics
   - Google Tag Manager snippet added to client/index.html. Replace GTM-XXXXXXX with your container ID.
   - Optional Plausible script commented in the head if you prefer Plausible analytics.

2) Advanced Projects UI
   - Search, tag chips, pagination, sort, featured filter added to PublicProjects.jsx.
   - Framer-motion animated project cards.

3) Contact Mailer
   - /api/contact endpoint added (uses nodemailer). Configure SMTP via env vars (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS).
   - Contact form page wired to POST /api/contact.

4) Upload flow
   - Admin Projects page has helper `handleFileUpload` calling /api/upload (Cloudinary util exists; fallback route writes to uploads/).
   - Upload route returns `{ success: true, url }` for client consumption.

5) Docker & process manager
   - Server Dockerfile at server/Dockerfile
   - Client Dockerfile at client/Dockerfile (builds static assets and serves via nginx)
   - PM2 ecosystem file at server/ecosystem.config.js

6) CI
   - GitHub Actions workflow at .github/workflows/ci.yml to build client and server.

7) Notes
   - For SSR/Next.js: not fully converted. Converting to Next.js is a substantial migration (routing, file layout, API routes). I can convert to Next.js if you want — tell me and I will do a focused migration.

Environment variables recommended:
- MONGO_URI, SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_RECEIVER, GTM_ID (replace GTM-XXXXXXX), etc.

