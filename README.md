# Hacker News Client (Angular)

A minimal, responsive Hacker News client built with Angular. Supports multiple feeds, user detail page, and a clean grid-based UI. Data is retrieved in real-time from the [official Hacker News API](https://github.com/HackerNews/API).  Includes CI with GitHub Actions and automatic deployment to GitHub Pages.

## Live Demo
https://dmate889.github.io/Hacker_News_assignment/

## Features
- Browse Hacker News feeds: Top, New, Best, Ask, Show, Jobs
- Pagination with Prev / Next controls (buttons are shown only when available)
- Post cards with title, author, points, and comments
- User details: username, karma, account creation date
- Fully responsive layout (using CSS grid)
- GitHub Actions workflow for:
  - Unit tests (Karma + Jasmine, headless Chrome)
  - Deploying the build to GitHub Pages

## Tech Stack
- ANgular 18.2.21
- RxJS for async data handling
- Karma + Jasmine for testing
- Github Actions for CI/CD

## Project Structure
src/app
├── core/         # API services & models
├── features/     # Feed list, post cards
├── shared/       # Shared components
├── user/         # User detail page
├── app.module.ts
└── app.component.ts

##Getting started
Clone repo and install dependencies:
```
git clone https://github.com/Dmate889/Hacker_News_assignment.git
cd Hacker_News_assignment
npm install
```

Run the development server:
 ```ng serve```

Navigate to http://localhost:4200

Run Unit tests:
```ng serve```

Build for production:
```ng build --configuration production --base-href "/Hacker_News_assignment/"```

## Future Improvements:
- Add comment view for stories
- More user profile details
- Search bar implementation
- Dark mode toggle


  
