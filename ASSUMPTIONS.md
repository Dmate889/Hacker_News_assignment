# Assumptions & Decisions

This document explains the main assumptions, design decisions, trade-offs, and known limitations of the project.

---

## Scope

- **Implemented:**  
  - Fetching feeds (top/new/best/ask/show/job) from the Hacker News API  
  - Fetching user profiles from the Hacker News API  
  - Pagination (20 items per page)  
  - Caching items in memory  
  - Basic error handling  
  - Unit tests for api and feed services and for the components 
  - CI/CD with GitHub Actions (tests + deploy to GitHub Pages)

---

## Key Decisions

For caching I decided to use a simple `Map<number, HnItem>`. This gives me constant time lookups and avoids the overhead of serializing data. I briefly considered using `localStorage`, but that would have required extra logic like TTLs and invalidation, which felt too heavy for the scope of this project.  

For pagination I went with a classic 20-items-per-page approach. This makes the user experience predictable and avoids the complexity of implementing infinite scroll, such as restoring scroll position or prefetching items.  

When fetching items, I chose `mergeMap` with a concurrency limit of 10. This allows several requests to happen in parallel, speeding up the page load without overwhelming the API.  

For state management I kept things simple. The feed service tracks the state with four values: `idle`, `loading`, `ready`, and `error`. This made it straightforward to control loading, pagination, and caching without adding unnecessary complexity. It also keeps the logic easy to follow and test.

Error handling happens at the item level. If a single item fails to load, it is skipped and the rest of the page still renders. This is done with a simple `catchError(() => of(null))`, so the user sees a complete feed even if one or two items fail.  

For testing, I covered the most important layers of the application. The feed service has unit tests because it contains the core business logic like pagination, caching, and error handling. I also wrote tests for the API service to make sure it integrates correctly with the Hacker News endpoints, and I added component tests to validate that the UI renders the data as expected. Since all feed types share the same logic, I didn’t duplicate tests for each one. Testing one flow was enough to demonstrate coverage.

Finally, I set up GitHub Actions for CI/CD. Each push runs the unit tests in a headless Chrome environment, and if the tests pass, the project is automatically deployed to GitHub Pages. I wanted to show familiarity with automated workflows, similar to what’s done with Jenkins in production environments.

---

## Future Improvements

There are several areas I would improve or extend if I had more time:

- **Search functionality** – allow users to quickly find posts instead of scrolling.  
- **Comments view** – create a dedicated component to fetch and display comment threads.  
- **Caching** – store items in `localStorage` with TTL to preserve state across reloads.  
- **Improved error handling** – add retry with exponential backoff for transient errors, and clearer UI messages. 
- **Authentication** – add a simple authentication flow with a lightweight backend service. Users could register and log in, sessions would be managed with JWT tokens, and user data stored in a SQLite3 database.
  
- **Styling** – enhance the UI design, improve responsiveness, implement Dark Mode.
