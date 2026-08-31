# LinkedIn Profile Extractor

A full-stack Next.js application that extracts structured professional information from a LinkedIn profile URL and presents the result through a clean, responsive UI.

The application accepts a LinkedIn profile URL, sends it to a server-side API, retrieves the profile information, normalizes it into a predictable structure, and displays the result in an organized profile view.

---

## Features

- LinkedIn profile URL validation
- Server-side profile extraction
- Structured profile data
- Profile overview
- Work experience
- Education
- Skills
- Certifications
- Profile metadata
- Loading and error states
- Copy complete profile data as JSON
- Responsive UI
- Light and dark mode support
- API endpoint for programmatic access
- Type-safe data structures using TypeScript
- Request validation using Zod

---

# Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Motion
- Tabler Icons

### Backend

- Next.js Route Handlers
- TypeScript
- Zod

### Data Source

The application uses LinkedIn's web application data/API responses to obtain profile information.

The extraction logic is kept on the server side so that authentication/session credentials are not exposed to the browser.

---

# Architecture

The application follows a simple client → API → extraction → normalized response architecture.

```text
                    ┌──────────────────────┐
                    │      User / UI       │
                    │                      │
                    │ LinkedIn Profile URL │
                    └──────────┬───────────┘
                               │
                               │ POST
                               ▼
                    ┌──────────────────────┐
                    │   Next.js API Route  │
                    │                      │
                    │ /api/v1/linkedin/    │
                    │ profile              │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Validation       │
                    │                      │
                    │        Zod           │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ LinkedIn Extraction  │
                    │                      │
                    │ Voyager / LinkedIn   │
                    │ response handling    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │ Data Normalization   │
                    │                      │
                    │ Profile              │
                    │ Experience           │
                    │ Education            │
                    │ Skills               │
                    │ Certifications       │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    JSON Response     │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    ProfileResult     │
                    │                      │
                    │  Structured UI       │
                    └──────────────────────┘