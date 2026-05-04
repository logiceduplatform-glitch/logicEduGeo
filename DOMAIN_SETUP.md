# Custom Domain Setup (kibloo.app)

## Step 1 — Register the domain

Recommended registrars:
- **Cloudflare Registrar** — at-cost pricing, free WHOIS privacy
- **Porkbun** — cheap renewals, good UX
- **Namecheap** — popular alternative

Cost estimate: ~12 €/year for `.app`

## Step 2 — Add custom domain to Firebase Hosting

```bash
firebase hosting:channel:open main
# Or via console:
# https://console.firebase.google.com/project/logic-education-platform/hosting/sites
# → Add custom domain → kibloo.app
```

Firebase will give you 2 records to add at your registrar:

```
A     @     151.101.1.195
A     @     151.101.65.195
```

(Optional but recommended)

```
CNAME www   logic-education-platform.web.app
```

DNS propagation: 5-60 minutes. Firebase auto-provisions SSL.

## Step 3 — Update site env var

Create `.env.production` (already gitignored):

```
VITE_SITE_URL=https://kibloo.app
```

Then rebuild:

```bash
npm run build
firebase deploy --only hosting
```

## Step 4 — Update Stripe & Resend dashboards

- **Stripe**: Settings → Branding → use `https://kibloo.app/icon-512.png` as logo
- **Stripe**: Webhook endpoint → add `https://europe-west1-logic-education-platform.cloudfunctions.net/stripeWebhook` (already configured)
- **Resend**: Domains → verify `kibloo.app` (add SPF/DKIM/DMARC TXT records they generate)
- **Google Search Console**: Add new property for `https://kibloo.app`, verify, submit sitemap

## Step 5 — Set up email

Recommended: forward `hello@kibloo.app` → your personal Gmail.

If you registered at Cloudflare, use Email Routing (free):
1. Cloudflare Dashboard → kibloo.app → Email → Email Routing
2. Routing rule: `hello@kibloo.app` → your-personal@gmail.com

## Step 6 — Social media handles

Reserve usernames @kibloo on:
- Twitter / X
- Instagram
- Facebook (Page)
- YouTube channel
- TikTok
