# YUVI Studio Wedding E-Invitation Creator — Reference Upgrade

This version is a mobile-first interactive wedding invitation builder inspired by the supplied reference video: emerald/green + gold luxury styling, arch hero, couple section, wedding details, invitation card, memories gallery, travel/help section, final save-the-date screen, and optional background music.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

Push the project to the existing GitHub repository and Vercel will redeploy automatically.

## What is included

- Couple names and photos
- Couple photo and invitation card
- Wedding date, time, venue and reception
- Family line and custom message
- 3 themes: Emerald, Royal, Blush
- Background music upload and play/pause
- Up to 12 gallery photos
- Full-screen invitation preview
- Google Maps location link
- Airport / train / explore cards
- Responsive 9:16 mobile-first invitation

## Important

This build is the interactive/shareable invitation layer. Actual server-side MP4 rendering should be added as a separate Remotion rendering service after the design is approved. Vercel can host the UI, while the render worker can generate MP4 files without putting heavy video rendering work into a normal Vercel request.
