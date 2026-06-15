# Date Quest Invite

A responsive, frontend-only date invitation website from Aarav.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Personalized Link

Add her name as a query parameter:

```text
http://localhost:3000/?name=Her%20Name
```

The plain URL still opens as the invite itself. The personalized URL changes the
headline and final WhatsApp/share message.

## What It Does

- Guides her through a cute date quest.
- Lets her pick the vibe, place, date, and time.
- Keeps the No button playfully dodging without recording a No.
- Opens WhatsApp directly to Aarav at `+91 8791598500` when she chooses Yes.
- Keeps a copy fallback for the final response text.

## Commands

```bash
npm run lint
npm run build
npm run build:static
```

## Free Deployment

Recommended easiest options:

- Netlify: connect the GitHub repo, build command `npm run build:static`, publish directory `static-dist`.
- Vercel: import the GitHub repo; `vercel.json` already points it to `npm run build:static` and `static-dist`.
- GitHub Pages: the included `.github/workflows/pages.yml` deploys `static-dist` after each push to `main`.

The invite URL can still use:

```text
https://your-site-url/?name=Her%20Name
```
