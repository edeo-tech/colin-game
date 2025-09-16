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

Admin Leaderboard Implementation Plan

  1. Data Structure & State Management

  - Polling System:
    - Use React Query with 10-second refetch interval
    - Implement refetchInterval: 10000 on both leaderboard queries
    - Track previous positions to detect changes for animations
  - State Requirements:
    - National leaderboard data with position tracking
    - School leaderboard data with position tracking
    - Date range filters (separate for each leaderboard)
    - Search filters (username for national, school name for schools)
    - Previous positions map for animation detection

  2. Component Architecture

  AdminLeaderboard
  ├── LeaderboardSection (reusable)
  │   ├── DateFilter
  │   ├── SearchInput (hidden by default)
  │   └── AnimatedLeaderboardList
  │       └── AnimatedLeaderboardEntry

  3. Animation System

  - Position Changes:
    - Track previous position in state
    - When position changes: slide animation up/down
    - New entries: fade + slide in from side
    - Use CSS transitions or Framer Motion
  - Animation States:
    - moving-up: green highlight + upward slide
    - moving-down: red highlight + downward slide
    - new-entry: yellow highlight + fade in
    - stable: no animation

  4. Search Filter Behavior

  - Implementation:
    - Filter entries but maintain original position numbers
    - Hidden entries create gaps in the visual list
    - Matching entries stay at their true position
    - Toggle search with keyboard shortcut (Ctrl+F)
  - Visual Example:
  Without filter:        With "mary" filter:
  1. John Smith
  2. Jane Doe
  3. Mary Jones         3. Mary Jones ✓
  4. Bob Wilson
  5. Mary Brown         5. Mary Brown ✓

  5. Date Filtering

  - Options for each leaderboard:
    - Today
    - Last 7 days
    - Last 30 days
    - Last 3 months
    - All time
    - Custom date range

  6. Technical Implementation Steps

  Phase 1: Update Queries & API

  - Add date range parameters to leaderboard queries
  - Implement polling with React Query
  - Create position tracking logic

  Phase 2: Create Base Components

  - Build LeaderboardSection component
  - Implement DateFilter dropdown
  - Create hidden SearchInput with toggle

  Phase 3: Animation System

  - Create AnimatedLeaderboardEntry component
  - Implement position change detection
  - Add CSS/Framer Motion animations

  Phase 4: Search Filter Logic

  - Implement search filtering while preserving positions
  - Add keyboard shortcut for search toggle
  - Ensure filtered items maintain original rankings

  Phase 5: Polish & Testing

  - Fine-tune animations timing
  - Test with rapid data changes
  - Ensure smooth performance with many entries

  7. Key Features Summary

  1. ✅ Dual leaderboards (national & school)
  2. ✅ 10-second auto-refresh
  3. ✅ Smooth animations for position changes
  4. ✅ Date filtering (independent for each)
  5. ✅ Hidden search with position preservation
  6. ✅ Visual indicators for rank changes

  8. Additional Considerations

  - Performance optimization for large lists
  - Smooth animations even with frequent updates
  - Clear visual feedback for data refreshes
  - Maintain scroll position during updates

● Update Todos
  ⎿  ☒ Create implementation plan for admin leaderboard

● This plan covers all your requirements:
  - ✅ Both national and school leaderboards
  - ✅ 10-second polling for live updates
  - ✅ Smooth animations for position changes and new entries
  - ✅ Separate date filters for each leaderboard
  - ✅ Hidden search that preserves position numbers
  - ✅ Clear structure for implementation

  The key insight is tracking previous positions to detect changes and using CSS classes to trigger appropriate
  animations. The search filter will use a "visibility" approach rather than removing items from the DOM, which allows us
  to maintain the original position numbers.

  Would you like me to proceed with implementing this plan?