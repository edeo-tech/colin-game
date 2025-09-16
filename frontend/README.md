This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

Implementation Plan for Dual Leaderboard System

  Phase 1: Backend Models & Database Structure

  1.1 Create New Models

  - NationalLeaderboard model with fields:
    - username (string, for filtering)
    - user_id (string, for user identification)
    - score (int, individual quiz score)
    - date (date, extracted from created_at for easier filtering)
    - Standard MongoBaseModel fields (id, created_at, updated_at)
  - SchoolLeaderboard model with fields:
    - school_id (string, reference to school)
    - school_name (string, for filtering and display)
    - total_score (int, sum of all users' scores for that school on that date)
    - date (date, for daily entries)
    - user_count (int, number of users who contributed to this total)
    - Standard MongoBaseModel fields

  1.2 Update Model Mappings

  - Add both collections to CollectionModelMatch
  - Remove or deprecate the old leaderboard collection

  Phase 2: Backend CRUD Functions

  2.1 National Leaderboard CRUD

  - create_national_entry() - Create individual user score entry
  - get_national_all_time() - Get highest score per user (no limit, all users)
  - get_national_by_date() - Get highest score per user for specific date
  - get_national_filtered() - Apply username filter to any result set

  2.2 School Leaderboard CRUD

  - create_or_update_school_entry() - Create new daily entry or update existing
  - get_school_all_time() - Sum all daily totals per school across all time
  - get_school_by_date() - Get all school scores for specific date
  - get_school_filtered() - Apply school name filter to any result set

  2.3 Combined Score Processing Function

  - process_quiz_completion() - Main function that:
    a. Creates national leaderboard entry
    b. If user has school_id, creates/updates school leaderboard entry
    c. Handles all the logic for daily school score aggregation

  Phase 3: Backend Routes Updates

  3.1 New Leaderboard Routes Structure

  - /app/leaderboard/national/all-time - Get all national scores (highest per user)
  - /app/leaderboard/national/date/{date} - Get national scores for specific date
  - /app/leaderboard/school/all-time - Get school totals (sum of all daily totals)
  - /app/leaderboard/school/date/{date} - Get school scores for specific date
  - /app/leaderboard/submit-score - Submit quiz score (replaces old create endpoint)

  3.2 Query Parameters

  - username filter for national leaderboards
  - school_name filter for school leaderboards
  - limit parameter (remove for all-time, keep for date-specific)

  Phase 4: Frontend Interface Updates

  4.1 New Interfaces

  - Update existing leaderboard interfaces
  - Add school leaderboard specific interfaces
  - Add filter parameters to query interfaces

  4.2 New API Functions

  - Update existing API calls to use new endpoints
  - Add functions for school leaderboard queries
  - Add filtering capabilities

  4.3 New Query Hooks

  - useNationalAllTime() with username filter
  - useNationalByDate() with username filter
  - useSchoolAllTime() with school name filter
  - useSchoolByDate() with school name filter

  Phase 5: Frontend UI Updates

  5.1 Leaderboard Page Restructure

  - Add tabs/sections for National vs School leaderboards
  - Add filter inputs (username for national, school name for school)
  - Add date picker for date-specific views
  - Update LeaderboardTable component to handle both types

  5.2 New Components

  - LeaderboardTabs - Switch between National/School
  - LeaderboardFilters - Handle username/school name/date filters
  - Update LeaderboardTable - Support both user and school entries

  Phase 6: Quiz Integration

  6.1 Update Quiz Completion

  - Modify quiz completion API call to use new /submit-score endpoint
  - Ensure user's school_id is passed if available
  - Handle both national and school leaderboard creation in single call

  Phase 7: Data Migration & Testing

  7.1 Migration Strategy

  - Create migration script to move existing leaderboard data to national_leaderboard
  - Aggregate existing data by school (if school associations exist)
  - Test with existing data

  7.2 Backward Compatibility

  - Keep old endpoints temporarily with deprecation warnings
  - Ensure existing frontend continues to work during migration

  ---
  Key Logic Points:

  1. National Leaderboard: One entry per quiz attempt, filtered to show highest score per user
  2. School Leaderboard: Daily aggregated totals per school, summed across all time for all-time view
  3. Quiz Completion Flow: Single API call creates both national entry and updates school total
  4. Filtering: Applied client-side on returned results for better UX
  5. Date Handling: Store date separately from timestamp for easier querying
  6. No Limits on All-Time: Return all users/schools for comprehensive leaderboards

  This plan maintains the existing functionality while adding the new dual leaderboard system with proper filtering
   and date-based queries. Would you like me to proceed with implementation, or do you have any modifications to
  this plan?