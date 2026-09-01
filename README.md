# LinkedIn Profile Extractor

A full-stack application that extracts structured professional information from a LinkedIn profile URL and presents the result through a clean, responsive UI.

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
- API endpoint for programmatic access
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

# How to Run the Project
1. Clone the repository
``` 
git clone https://github.com/kinshuk-dewari/tross.git
cd tross
```
2. Install dependencies

Using npm:
```
npm install
```

3. Setup Environment Variables

Create a `.env.local file` in the root of the project:
```
LINKEDIN_LI_AT=your_linkedin_li_at_cookie
LINKEDIN_JSESSIONID=your_linkedin_jsessionid
```
These credentials are used by the backend to authenticate requests to LinkedIn.

4. Start Development Server

Run:

``` 
npm run dev
```
The application will be available at:`http://localhost:3000`

Open the URL in your browser and enter a LinkedIn profile URL.

Example:
```
https://www.linkedin.com/in/example/
```
Successful Response

Example:
```
{
  "profile": {
    "id": "example-id",
    "publicIdentifier": "example",
    "firstName": "John",
    "lastName": "Doe",
    "name": "John Doe",
    "headline": "Software Engineer",
    "location": "New York, United States",
    "about": "Software engineer with experience building web applications.",
    "profileImage": "https://example.com/profile.jpg",
    "experience": [],
    "education": [],
    "skills": [
      "JavaScript",
      "TypeScript",
      "React"
    ],
    "certifications": [],
    "languages": [
      {
        "name": "English",
        "proficiency": "Professional working proficiency"
      }
    ],
    "url": "https://www.linkedin.com/in/example/"
  },
  "meta": {
    "source": "linkedin-voyager",
    "publicIdentifier": "example"
  }
}
```

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
```
