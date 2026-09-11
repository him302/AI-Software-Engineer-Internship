# CampusIQ

### Discover. Compare. Decide.

## Overview
Students face fragmented information about colleges and struggle to determine which institutions actually fit their rank, course preferences, and budget. CampusIQ solves this by aggregating fees, placements, and historical cutoffs into one clean dashboard. It helps students discover, evaluate, and compare colleges by transforming messy data into a structured decision-making experience.

## Features
* **College Discovery**: Advanced search and filtering by state, course, institution type, and budget.
* **College Intelligence**: Detailed dashboards for each college showing key statistics, programs, and verified placement records.
* **Compare Colleges**: Put up to 3 colleges side-by-side to visually compare outcomes, ROI, and fees.
* **College Predictor**: An intelligent recommendation engine that analyzes historical cutoffs to predict your admission probability.
* **Authentication**: Secure signup and login with hashed passwords and HTTP-only cookies.
* **Saved Colleges**: Bookmark colleges for later review.
* **Saved Comparisons**: Save specific groups of colleges to easily return to your analysis.

## Tech Stack
* **Frontend:** Next.js (App Router), React, TypeScript, TailwindCSS
* **Backend:** Node.js, Next.js API Routes (Route Handlers)
* **Database:** PostgreSQL + Prisma ORM
* **Authentication:** Next.js Server Actions, bcryptjs, custom JWT/Session cookies

## Architecture
```text
User
 ↓
Next.js Frontend (React Client Components)
 ↓
Next.js API Routes (Route Handlers)
 ↓
Services / Business Logic (Validation & Auth Checks)
 ↓
Prisma ORM
 ↓
PostgreSQL
```

## Database
The database is highly normalized to prevent data duplication:
* **User**: Handles authentication with secure password hashes.
* **College**: The core entity storing primary attributes, optimized with geographic and financial indexes.
* **Course**: A catalog of available courses.
* **AdmissionCutoff**: Stores historical closing ranks by exam, category, and course, uniquely indexed for hyper-fast predictor lookups.
* **SavedCollege / SavedComparison**: Relationship tables mapping authenticated users to their private saved resources.

## Predictor
The predictor is a transparent, rule-driven decision support engine. It takes the user's exam rank, category, and preferences, and queries the `AdmissionCutoff` table for historical trends. It calculates a variance score and deterministically classifies matches as "Strong Match", "Possible", or "Ambitious", providing clear, human-readable explanations for its recommendations without relying on mysterious "black box" ML models.

## Authentication
Authentication is fully bespoke (no heavy NextAuth dependencies). It uses secure `bcryptjs` password hashing and securely sets stateless JWT-like session payloads in encrypted, HTTP-only cookies via Next.js `cookies()`. All API routes interacting with user data strictly verify this session before querying the database, ensuring complete cross-user data isolation.

## Local Development
1. Clone the repository and run `npm install`.
2. Ensure you have a local PostgreSQL instance running.
3. Configure your `.env` file (see below).
4. Run `npx prisma db push` to synchronize the schema.
5. Run `npm run prisma:seed` to populate realistic data.
6. Run `npm run dev` to start the development server.

## Environment Variables
Copy the `.env.example` file to a new `.env` file and provide your actual credentials:
```text
DATABASE_URL="postgresql://user:password@localhost:5432/campusiq?schema=public"
# Note: Use a real secure secret in production environments
AUTH_SECRET="your-super-secure-random-secret-key-change-in-production"
```

## Deployment
CampusIQ is fully configured for deployment on **Vercel**. 
1. Connect your GitHub repository to Vercel.
2. Provision a PostgreSQL database (e.g., Neon, Railway, or Supabase).
3. Add the `DATABASE_URL` and a strong `AUTH_SECRET` to Vercel's Environment Variables settings.
4. Set the Build Command to `npm run build`. Vercel will automatically generate the Prisma Client during the build step.
5. Run `npx prisma migrate deploy` in your production database if required.

## Limitations
* The data populated via the seeder is **historical sample data** meant for demonstration purposes only.
* The College Predictor is strictly informational and relies on historical trends; it provides **no guarantee of admission**.

## Future Improvements
* Integration of real-time verified data feeds from institutional APIs.
* OAuth2 integration (Google/GitHub) for frictionless onboarding.
* Advanced analytics dashboard for administrative staff to track institutional engagement.
