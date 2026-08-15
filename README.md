# Heruwala Landing Site

A React single-page experience for [heruwala.com](https://www.heruwala.com/) that presents an expressive under-construction message with animated telemetry, milestone cards, and responsive layout.

Security response headers are defined in `public/staticwebapp.config.json` so Azure Static Web Apps can emit Content-Security-Policy, X-Frame-Options, and Permissions-Policy. Fonts are self-hosted to keep the CSP strict.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start development server:

```bash
npm start
```

3. Open http://localhost:3000

## Quality Checks

Run tests:

```bash
npm test
```

Create production build:

```bash
npm run build
```

## Notes

- The app currently uses Create React App tooling.
- Some package majors remain pinned for compatibility with the current CRA stack.
