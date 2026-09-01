# Tross — LinkedIn Profile Scraper

A full-stack LinkedIn profile data extraction application built with Next.js and TypeScript.
It accepts a LinkedIn profile URL along with the user's authenticated LinkedIn session credentials (`li_at` and `JSESSIONID`) and returns structured professional profile information.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Testing Through the Frontend](#testing-through-the-frontend)
- [API Documentation](#api-documentation)
- [Testing With Postman](#testing-with-postman)
- [Testing Through Terminal](#testing-through-terminal)
- [Request Flow](#request-flow)
- [Internal Modules](#internal-modules)
- [Design Approach](#design-approach)
- [Error Handling](#error-handling)
- [Known Limitations](#known-limitations)
## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Tabler Icons

### Backend

- Next.js App Router
- Next.js Route Handlers
- TypeScript
- Zod
- Native Fetch API

## Project Structure

```text
tross/
│
├── app/
│   ├── api/
│   │   └── v1/
│   │       └── linkedin/
│   │           └── profile/
│   │               └── route.ts
│   │
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── InputBox.tsx
│   └── Profile.tsx
│
├── lib/
│   └── linkedin/
│       ├── client.ts
│       ├── parser.ts
│       ├── profile-url.ts
│       ├── types.ts
│       └── validation.ts
│
├── public/
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

---

# Architecture

```
                         ┌──────────────────────┐
                         │       Browser        │
                         │                      │
                         │ LinkedIn Profile URL │
                         │ li_at                │
                         │ JSESSIONID           │
                         └──────────┬───────────┘
                                    │
                                    │ POST
                                    ▼
                    ┌──────────────────────────────┐
                    │        Next.js API           │
                    │                              │
                    │ /api/v1/linkedin/profile     │
                    │                              │
                    │ - Validate request           │
                    │ - Read headers               │
                    │ - Extract identifier         │
                    │ - Handle errors              │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                    ┌──────────────────────────────┐
                    │       LinkedIn Client        │
                    │                              │
                    │ - Build Voyager request      │
                    │ - Build authentication       │
                    │   headers                    │
                    │ - Send request               │
                    │ - Handle timeout/errors      │
                    └──────────────┬───────────────┘
                                   │
                                   │ HTTPS
                                   ▼
                    ┌──────────────────────────────┐
                    │          LinkedIn            │
                    │                              │
                    │       Voyager API            │
                    └──────────────┬───────────────┘
                                   │
                                   │ JSON
                                   ▼
                    ┌──────────────────────────────┐
                    │           Parser             │
                    │                              │
                    │ Normalize raw LinkedIn data  │
                    └──────────────┬───────────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │     Frontend     │
                         │                  │
                         │ Profile display  │
                         └──────────────────┘
```

---

# How It Works

The application uses a request-time credential model.

The user provides:

1. LinkedIn `li_at`
2. LinkedIn `JSESSIONID`
3. LinkedIn profile URL

The frontend sends the credentials as HTTP headers to the backend.

The profile URL is sent in the request body.

The backend then:

1. Validates the incoming request.
2. Reads the `li_at` and `JSESSIONID` headers.
3. Extracts the public identifier from the LinkedIn URL.
4. Creates an authenticated LinkedIn request.
5. Calls the LinkedIn Voyager endpoint.
6. Receives the raw LinkedIn response.
7. Passes the response through the parser.
8. Returns a normalized profile object.
9. The frontend displays the resulting profile.

---

# Getting Started

## Prerequisites

Make sure you have:

- Node.js 18 or newer
- npm
- A LinkedIn account for testing

Verify your installation:

```bash
node --version
npm --version
```

---

# Installation

Clone the repository:

```bash
git clone https://github.com/kinshuk-dewari/tross.git
```

Navigate into the project:

```bash
cd tross
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---


# Testing Through the Frontend

Start the application:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The frontend accepts:

```text
LinkedIn li_at
LinkedIn JSESSIONID
LinkedIn profile URL
```

For assessment/testing purposes, obtain the values from an authenticated LinkedIn browser session and enter them into the corresponding fields.

Then click:

```text
Search profile
```

The frontend sends:

```http
POST /api/v1/linkedin/profile
```

with the credentials as request headers and the profile URL as JSON.

The returned structured profile is displayed in the UI.

---

# Getting LinkedIn Session Values

For testing purposes:

1. Open LinkedIn in your browser.
2. Log in to your LinkedIn account.
3. Open browser Developer Tools.
4. Open the browser's cookie storage for LinkedIn.
5. Locate:
   - `li_at`
   - `JSESSIONID`
6. Copy the values.
7. Paste them into the Tross frontend.

The application does not automatically read cookies from another browser tab. The values are manually supplied to the application.

---

# API Documentation

## Get LinkedIn Profile

### Endpoint

```http
POST /api/v1/linkedin/profile
```

### Local

```text
http://localhost:3000/api/v1/linkedin/profile
```

### Production

```text
https://tross-sigma.vercel.app/api/v1/linkedin/profile
```

---

## Request Headers

| Header | Required | Description |
|---|---|---|
| `Content-Type` | Yes | Must be `application/json` |
| `li_at` | Yes | LinkedIn authenticated session cookie value |
| `JSESSIONID` | Yes | LinkedIn session identifier |

Example:

```http
Content-Type: application/json
li_at: YOUR_LI_AT_VALUE
JSESSIONID: YOUR_JSESSIONID_VALUE
```

---

## Request Body

```json
{
  "url": "https://www.linkedin.com/in/example/"
}
```

---

# Testing With Postman

The backend can be tested independently from the frontend.

## Step 1 — Start the server

```bash
npm run dev
```

---

## Step 2 — Create a POST request

Open Postman and create a new request.

Select:

```text
POST
```

Use:

```text
http://localhost:3000/api/v1/linkedin/profile
```

---

## Step 3 — Add Headers

Open the **Headers** tab.

Add the following:

| Key | Value |
|---|---|
| `Content-Type` | `application/json` |
| `li_at` | Your LinkedIn `li_at` value |
| `JSESSIONID` | Your LinkedIn `JSESSIONID` value |

Example:

```text
Content-Type    application/json
li_at           YOUR_LI_AT_VALUE
JSESSIONID      YOUR_JSESSIONID_VALUE
```

---

## Step 4 — Add Request Body

Go to:

```text
Body → raw → JSON
```

Enter:

```json
{
  "url": "https://www.linkedin.com/in/example/"
}
```

Replace the URL with the LinkedIn profile you want to test.

---

## Step 5 — Send

Click **Send**.

If the credentials are valid and the profile is accessible, the API will return the structured profile.

---

# Testing Through Terminal

The API can also be tested directly from a terminal using `curl`.

## Local API

```bash
curl -X POST "http://localhost:3000/api/v1/linkedin/profile" ^
  -H "Content-Type: application/json" ^
  -H "li_at: YOUR_LI_AT_VALUE" ^
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" ^
  -d "{\"url\":\"https://www.linkedin.com/in/example/\"}"
```

The above command uses Windows CMD syntax.

### PowerShell

If using PowerShell:

```powershell
curl.exe -X POST "http://localhost:3000/api/v1/linkedin/profile" `
  -H "Content-Type: application/json" `
  -H "li_at: YOUR_LI_AT_VALUE" `
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" `
  -d '{"url":"https://www.linkedin.com/in/example/"}'
```

### macOS / Linux / Git Bash

```bash
curl -X POST "http://localhost:3000/api/v1/linkedin/profile" \
  -H "Content-Type: application/json" \
  -H "li_at: YOUR_LI_AT_VALUE" \
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" \
  -d '{"url":"https://www.linkedin.com/in/example/"}'
```

---

# Testing the Production API

The deployed API is:

```text
https://tross-sigma.vercel.app/api/v1/linkedin/profile
```

## Windows CMD

```bash
curl -X POST "https://tross-sigma.vercel.app/api/v1/linkedin/profile" ^
  -H "Content-Type: application/json" ^
  -H "li_at: YOUR_LI_AT_VALUE" ^
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" ^
  -d "{\"url\":\"https://www.linkedin.com/in/example/\"}"
```

## PowerShell

```powershell
curl.exe -X POST "https://tross-sigma.vercel.app/api/v1/linkedin/profile" `
  -H "Content-Type: application/json" `
  -H "li_at: YOUR_LI_AT_VALUE" `
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" `
  -d '{"url":"https://www.linkedin.com/in/example/"}'
```

## macOS / Linux / Git Bash

```bash
curl -X POST "https://tross-sigma.vercel.app/api/v1/linkedin/profile" \
  -H "Content-Type: application/json" \
  -H "li_at: YOUR_LI_AT_VALUE" \
  -H "JSESSIONID: YOUR_JSESSIONID_VALUE" \
  -d '{"url":"https://www.linkedin.com/in/example/"}'
```

---

# Example Successful Response

A successful response follows this general structure:

```json
{
  "profile": {
    "name": "...",
    "headline": "...",
    "location": "...",
    "about": "...",
    "experiences": [],
    "education": [],
    "skills": []
  },
  "meta": {
    "source": "linkedin-voyager",
    "publicIdentifier": "example"
  }
}
```

The exact profile fields depend on the data returned by LinkedIn and the parser implementation.

---

# Request Flow

The client sends:

```http
POST /api/v1/linkedin/profile
Content-Type: application/json
li_at: YOUR_LI_AT_VALUE
JSESSIONID: YOUR_JSESSIONID_VALUE
```

with:

```json
{
  "url": "https://www.linkedin.com/in/example/"
}
```

The backend:

```text
Request
  ↓
Read Headers
  ↓
Validate Body
  ↓
Extract Public Identifier
  ↓
LinkedIn Client
  ↓
LinkedIn Voyager
  ↓
Raw Response
  ↓
Parser
  ↓
Normalized Profile
  ↓
JSON Response
```

---

# Internal Modules

## `app/api/v1/linkedin/profile/route.ts`

Responsible for:

- Handling HTTP requests
- Reading authentication headers
- Validating the request body
- Extracting the LinkedIn public identifier
- Calling `LinkedInClient`
- Calling the profile parser
- Returning JSON responses
- Mapping errors to HTTP status codes

---

## `lib/linkedin/client.ts`

Responsible for communicating with LinkedIn.

It handles:

- Voyager endpoints
- Request headers
- Session authentication
- CSRF token
- User-Agent
- Request timeout
- Upstream HTTP errors

---

## `lib/linkedin/profile-url.ts`

Responsible for extracting the public identifier from a LinkedIn profile URL.

Example:

```text
https://www.linkedin.com/in/john-doe/
```

becomes:

```text
john-doe
```

---

## `lib/linkedin/validation.ts`

Responsible for validating API input using Zod.

Invalid requests are rejected before making the upstream LinkedIn request.

---

## `lib/linkedin/parser.ts`

Responsible for converting LinkedIn's raw Voyager response into the application's normalized profile structure.

This keeps LinkedIn's internal response structure isolated from the frontend.

---

## `lib/linkedin/types.ts`

Contains TypeScript types used by the LinkedIn integration and normalized profile data.

---

# Design Approach

## Separation of Concerns

The project separates the application into independent layers:

```text
Route
  ↓
Validation
  ↓
URL Extraction
  ↓
LinkedIn Client
  ↓
LinkedIn Response
  ↓
Parser
  ↓
Normalized Profile
```

This makes individual parts easier to maintain and modify.

---

## Request-Time Authentication

LinkedIn credentials are not hardcoded into the application.

They are supplied with each request:

```text
Frontend
   │
   │ li_at + JSESSIONID
   ▼
Backend
   │
   ▼
LinkedIn
```

This allows different users to test the application using their own authenticated LinkedIn sessions.

---

## Normalized Response

The frontend does not directly consume LinkedIn's raw Voyager response.

Instead:

```text
LinkedIn Raw Response
        ↓
      Parser
        ↓
Normalized Profile
        ↓
    Frontend
```

This keeps the frontend independent of LinkedIn's internal response structure.

---

## API Versioning

The endpoint uses:

```text
/api/v1/linkedin/profile
```

The `/v1/` versioning allows future API versions to be introduced without necessarily breaking existing clients.

For example:

```text
/api/v1/linkedin/profile
/api/v2/linkedin/profile
```

could coexist in a future implementation.

---

## Error Handling

Errors are handled at multiple levels.

### Request Validation

Invalid input returns:

```http
400 Bad Request
```

### LinkedIn Rate Limiting

LinkedIn `429` responses are mapped to:

```http
429 Too Many Requests
```

### LinkedIn Server Errors

Upstream server failures are mapped to:

```http
502 Bad Gateway
```

### Request Timeout

The LinkedIn client uses `AbortController` to prevent an upstream request from hanging indefinitely.

---

# Error Responses

## Invalid Request

```http
400 Bad Request
```

Example:

```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "details": {}
  }
}
```

---

## LinkedIn Upstream Error

Example:

```json
{
  "error": {
    "code": "LINKEDIN_UPSTREAM_ERROR",
    "message": "LinkedIn returned HTTP 429"
  }
}
```

---

## Internal Error

Example:

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Unexpected server error"
  }
}
```

---

# Known Limitations

## 1. LinkedIn Voyager Is an Internal API

The application relies on LinkedIn's internal Voyager endpoints rather than an official public LinkedIn API.

LinkedIn can change endpoint structures, headers, response formats, or access requirements at any time.

---

## 2. LinkedIn Credentials Are Required

A valid authenticated LinkedIn session is required.

The application expects:

```text
li_at
JSESSIONID
```

Expired or invalid credentials may cause LinkedIn to reject the request.

---

## 3. Profile Accessibility

Not every LinkedIn profile is guaranteed to be accessible.

Results can depend on:

- Profile visibility
- Authenticated user permissions
- LinkedIn restrictions
- Account state
- LinkedIn access policies

---

## 4. Rate Limiting

LinkedIn may rate-limit requests.

If LinkedIn returns:

```http
429 Too Many Requests
```

the application returns the corresponding rate-limit response.

---

## 5. Response Schema Changes

The application depends on LinkedIn's internal response structure.

If LinkedIn changes its Voyager response format, the parser may need to be updated.

The main file affected would be:

```text
lib/linkedin/parser.ts
```

---

## 6. Manual Credential Input

The frontend cannot automatically retrieve LinkedIn cookies from another browser tab because of browser security and same-origin restrictions.

Therefore, the assessment implementation requires the user to manually provide:

```text
li_at
JSESSIONID
```

---

## 7. No Official LinkedIn OAuth Flow

The current implementation does not use LinkedIn OAuth.

Instead, it works with session credentials supplied by the user.

An OAuth-based architecture would be more appropriate for a production application intended to integrate with LinkedIn's supported APIs.

---

