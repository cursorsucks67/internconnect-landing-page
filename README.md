# Internconnected Pre-Build Campaign

This workspace implements the Internconnected pre-build growth system for the summer 2026 NYC intern cohort.

## What Is Included

- `app/` - Next.js App Router entrypoints for the Vercel site.
- `components/LandingPage.tsx` - client-rendered landing page and prototype signup/referral behavior.
- `styles.css` - polished responsive page styling and mock app visuals.
- `public/assets/` - deployable image assets served by Next.js/Vercel.
- `campaign-assets/notion-launch-hq.md` - Notion workspace structure for campaign operations.
- `campaign-assets/signup-tracker-template.csv` - importable signup tracker schema.
- `campaign-assets/ambassador-playbook.md` - Founding Intern Captain outreach and onboarding.
- `campaign-assets/content-bank.md` - short-form scripts, LinkedIn captions, group chat blurbs, and club outreach.
- `campaign-assets/nyc-intern-pulse-sample.md` - sample Pulse report.
- `campaign-assets/research-targets-template.csv` - CRM template for clubs, creators, and communities.

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://127.0.0.1:3000
```

## Build For Vercel

```bash
npm run build
```

## Launch Notes

The form currently stores submissions in browser `localStorage` for prototype testing. Before public launch, connect the form to a Next.js route handler, Tally, Typeform, Airtable, Google Sheets, or a small backend endpoint.

The page intentionally uses concept visuals. Keep the “Concept preview. Early access opens as pods unlock.” language visible until a real product surface exists.
