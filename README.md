# Tross LinkedIn Profile API - Next.js

Server-side Next.js Route Handler that directly calls LinkedIn Voyager over HTTP. No Playwright, Puppeteer, Selenium, or browser automation is used in the request path.

## Install

npm install zod

## Environment

Create `.env.local` and set `LINKEDIN_LI_AT` and `LINKEDIN_JSESSIONID` from your own authenticated session. Never commit them.

## Run

npm run dev

POST `/api/v1/linkedin/profile` with `{ "url": "https://www.linkedin.com/in/example/" }`.

## Endpoint

`GET /voyager/api/identity/dash/profiles?q=memberIdentity&memberIdentity=<publicIdentifier>&decorationId=com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-101`

The parser resolves the normalized `data.*elements` -> `included[]` entity graph and walks profile-owned position groups and education references.

LinkedIn internal endpoints and query identifiers can change. Skills/certifications/languages are parsed when their collection references are present; if absent, capture the corresponding current profile-section requests and add them as provider calls.
