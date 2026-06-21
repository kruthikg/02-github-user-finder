# GitHub User Finder

A small React app to search GitHub users, view a clean profile card, and compare
two developers side by side. Built with the public GitHub API.

## Features
- Search any GitHub username and see their profile
- Profile card with top languages, most-starred repos, followers and join year
- Shareable link — the username is saved in the URL (`?user=name`) and a "Copy link" button
- Compare two users side by side with a quick "who leads" summary

## Tech
React · TypeScript · Vite

## Run locally
```bash
npm install
npm run dev
```
Then open the URL shown in the terminal (usually http://localhost:5173).

## Build
```bash
npm run build
```
The production files are generated in the `dist` folder.

## Deploy (Vercel)
1. Push the repo to GitHub.
2. On Vercel, **Add New → Project** and import the repo.
3. Vercel detects Vite automatically and deploys. Every push to `main` redeploys.

## Note
The GitHub API allows 60 requests per hour without a token, so heavy use may hit
that limit temporarily.
