<div align="center">

# Technical Resource Hub

**A focused study workspace for computer science students — documentation, a real online compiler, automatic streak tracking, and per-user progress that syncs across devices.**

🔗 **Live demo:** [alihasanli.com](https://alihasanli.com)

[![Built with React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Judge0](https://img.shields.io/badge/Judge0-Online%20Compiler-ff7a45)](https://judge0.com/)
[![Resend](https://img.shields.io/badge/Resend-Transactional%20Email-000000?logo=resend&logoColor=white)](https://resend.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?logo=vercel&logoColor=white)](https://alihasanli.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

[![Lighthouse Performance](https://img.shields.io/badge/Performance-99-brightgreen?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis/https-alihasanli-com/?form_factor=desktop)
[![Lighthouse Accessibility](https://img.shields.io/badge/Accessibility-98-brightgreen?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis/https-alihasanli-com/?form_factor=desktop)
[![Lighthouse Best Practices](https://img.shields.io/badge/Best_Practices-100-brightgreen?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis/https-alihasanli-com/?form_factor=desktop)
[![Lighthouse SEO](https://img.shields.io/badge/SEO-100-brightgreen?logo=lighthouse&logoColor=white)](https://pagespeed.web.dev/analysis/https-alihasanli-com/?form_factor=desktop)

<br />

<!--
  Live auto-screenshot of the production site via thum.io.
  No file is committed — the image URL is fetched fresh by GitHub's image
  proxy, so the README always shows the current state of alihasanli.com.
-->

[![Live screenshot of alihasanli.com](https://image.thum.io/get/maxAge/12/width/1200/noanimate/https://alihasanli.com)](https://alihasanli.com)

</div>

---

## What it does

Resource Hub is a single-page study workspace built around four things students actually use:

- **Documentation Viewer** — 18 hand-written cards across *Algorithms*, *Logic Problems*, and *Exam Prep* with complexity analysis, common mistakes, step-by-step solutions, and practice tips.
- **Code Playground** — 11 reference Java snippets (Binary Search, Merge Sort, Two Sum, Stack, Tree Traversal, …) with a faux IDE chrome, custom syntax highlighting, and one-click expected-output preview.
- **Online Compiler** — a real editable code editor with **autocomplete** (keyword / type / function / snippet suggestions plus locals harvested from your own code), bracket auto-pair, Enter auto-indent, and Tab indentation. Runs **Java, Python, and C++** in the browser via the [Judge0 CE](https://judge0.com/) public endpoint. Output, stderr, and compile errors are surfaced separately. Code length is capped at 10 000 chars.
- **Mock Exams** — timed-style practice tests mixing auto-graded multiple choice (A–D, with explanations) and AP-CSA-style coding free-response questions (full Java class declarations, self-checked against a model answer). Best score is saved per test.
- **Progress Tracker** — a dashboard with a study-streak counter that increments **automatically** when the student reads a topic, marks something as mastered, runs code, takes a test, or dwells for 2 minutes on a page. No manual "log session" button.

Every user gets their own account (Supabase Auth), their own profile (name, bio, avatar uploaded to Supabase Storage), and their own progress — synced across devices.

## Screenshots

The fastest way to feel the app is the [live demo](https://alihasanli.com). What you'll see:

- **Dashboard** — time-of-day greeting, premium stat widgets for streak and mastery, six quick-access tiles, daily recommendation, tip of the day.
- **Documentation** — gradient-bordered topic cards with an expandable "Read more" surface that reveals step-by-step solutions, common mistakes, and practice tips.
- **Online Compiler** — multi-language editor with autocomplete, bracket auto-pair, Enter auto-indent, tab indentation; runs via Judge0, separate panels for `stdout`, `stderr`, and compile output, plus stdin support.
- **Mock Exams** — pick a test, answer A–D multiple choice and Java coding free-response, submit for an auto-graded score with per-question explanations and model solutions.
- **Profile** — student-ID card with holographic header strip, click-to-upload avatar, badges grid, recently viewed topics, and a Danger Zone for account deletion.

## Why I built this

I built Technical Resource Hub because I noticed that many students, including me, often study computer science from scattered sources: one website for documentation, another for code examples, another compiler to test ideas, and sometimes a notebook or spreadsheet to track progress. When I sat down to prepare for the AP Computer Science A exam in May, I counted seven tabs open at once — Wikipedia for Merge Sort, a half-broken online Java compiler, a Google Doc for notes, and Discord to ask classmates. I lost my place every time I switched between them. I wanted to create one focused workspace where a student could read a clear explanation, test code immediately, and see their progress without switching between many tools.

The hardest part was making the project feel like a real product instead of just a collection of pages. Adding authentication, per-user progress, synced profiles, automatic streak tracking, and a real online compiler forced me to think about software design more seriously. The lesson that stuck wasn't about features — it was about a single bug. For a week, clicking my own profile picture opened a preview modal instead of the file picker for uploads, and I couldn't figure out why. The answer turned out to be a click handler I had wired up in an earlier version and forgotten about. Fixing it taught me more about reading my own code than any feature I shipped that week.

What surprised me most was how many small details matter: error messages, mobile performance, routing, loading states, and data security. If I started again, I would plan the architecture earlier and write tests from the beginning.

## Highlights an interviewer might ask about

- **Real backend auth, not localStorage.** Supabase email-and-password with verified emails delivered through [Resend](https://resend.com) on a custom-authenticated `noreply@alihasanli.com` sender (DKIM + SPF + DMARC), full password reset flow via one-time emailed link, account deletion via a `SECURITY DEFINER` Postgres function that an authenticated user can only invoke on their own row.
- **Row-Level Security everywhere.** Two tables (`profiles`, `user_state`) plus the `avatars` storage bucket, all locked down so users can physically only read or write their own rows / their own folder.
- **Defense-in-depth file upload.** Avatar uploads are sniffed for actual magic bytes (`FF D8 FF` for JPEG, `89 50 4E 47` for PNG, the `RIFF…WEBP` window for WebP, …) — the browser-reported MIME is treated as untrusted because file extensions are spoofable.
- **Auto-streak via activity inference.** Streak doesn't need a "log session" button. The hook reads `last_activity_date` from Supabase, compares to today, and either increments, resets, or no-ops idempotently. Any user-driven action calls `logActivity()`.
- **Hash routing without React Router.** A 60-line `parseHash` / `buildHash` pair gives every section a real URL (`/#/docs/algorithms`, `/#/playground/binary-search`, …) so the browser back/forward buttons actually work. Chosen over pathname routing so the static host needs no rewrites.
- **Performance work for weak devices.** `useReducedMotion` honors the OS preference, `MotionConfig reducedMotion="user"` propagates to framer-motion, `backdrop-blur` is downgraded on `< md` viewports, the background pattern is `attachment: scroll` on mobile, and the four heavy sections (Documentation, Playground, Compiler, Profile) are lazy-loaded as separate chunks.
- **localStorage cache layer.** A module-level `Map` deduplicates `JSON.parse` across hooks reading the same key, with cross-component sync via a custom `trh:localStorage:set` event so writing from one component instantly updates every other consumer.

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Build / dev | Vite 8 + React 19 | Sub-second HMR, Rollup-based production splits |
| Styling | Tailwind 3 + custom design tokens | Dark glassmorphism with electric-violet / cyan / soft-gold accents |
| Animation | framer-motion (sparingly) + CSS transitions | Heavy work happens in CSS; framer-motion only for AnimatePresence and drawer slide |
| Auth + DB + Storage | Supabase (free tier) | bcrypt-hashed passwords server-side, JWT sessions, Postgres with RLS, S3-backed storage |
| Code execution | [Judge0 CE](https://judge0.com/) | Sandboxed Java / Python / C++ runtime via the `ce.judge0.com` public endpoint, HTTPS-only |
| Icons | lucide-react | Tree-shakeable, per-icon imports |
| Hosting | [Vercel](https://vercel.com) | Auto-deploy on every `main` push, custom domain `alihasanli.com` |
| Transactional email | [Resend](https://resend.com) | DKIM/SPF/DMARC-authenticated `noreply@alihasanli.com` via the free tier |

## Quick start

```bash
git clone https://github.com/mdaelali/technical-resource-hub.git
cd technical-resource-hub
npm install
cp .env.example .env.local        # then fill in the keys (see Supabase setup below)
npm run dev                       # serves at http://localhost:5173
```

```bash
npm run build      # production bundle in dist/
npm run preview    # preview the built bundle locally
```

## Project layout

```
src/
  api/                  Supabase + Judge0 service modules
    supabaseClient.js     single createClient + isSupabaseConfigured flag
    profileService.js     profiles + avatar upload (with magic-byte sniff + cleanup)
    stateService.js       user_state read/write
    judge0.js             code execution client (Judge0 CE public endpoint)
    piston.js             Piston client, retained for use with a self-hosted Piston instance
  auth/
    AuthContext.jsx       signUp / signIn / signOut / resetPassword / deleteAccount
  state/
    RemoteSync.jsx        seeds local cache on login, debounced push to Supabase
  hooks/
    useLocalStorage.js    cached, event-synced storage
    useUserStorage.js     per-user scoped storage
    useStreak.js          idempotent auto-streak logic
    useRecentlyViewed.js  most-recent-N tracking
    useReducedMotion.js   prefers-reduced-motion subscription
  components/
    auth/                 Login / Signup / ForgotPassword / ResetPassword pages
    Sidebar.jsx           desktop static + mobile drawer
    Topbar.jsx            search, notifications, profile avatar
    Dashboard.jsx         greeting, stats, quick access, recommendation
    DocumentationViewer.jsx
    CodePlayground.jsx    read-only reference snippets
    CodeCompiler.jsx      editable, Judge0-backed
    CodeEditor.jsx        textarea-overlay editor with syntax highlight
    ProgressTracker.jsx   premium stat widgets, mastery bars
    Profile.jsx           student-ID card, badges, recent topics, danger zone
  utils/
    security.js           SHA-256 helpers, validators, sanitizer, magic-byte sniff
    highlightCode.js      shared Java / Python / C++ tokenizer
  data/
    docs.js               18 study cards across 3 categories
    snippets.js           11 Java reference snippets
supabase/
  schema.sql            tables, RLS policies, storage policies, delete_my_account()
```

## Supabase setup (one-time, ~10 min)

The app needs a Supabase project for sign-up, sign-in, profile data, progress sync, and avatar storage.

1. Create a free project at [supabase.com](https://supabase.com).
2. Copy your credentials from *Project Settings → API*:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public` key → `VITE_SUPABASE_ANON_KEY`
3. SQL Editor → paste and run [`supabase/schema.sql`](./supabase/schema.sql). It creates:
   - `public.profiles` (name, bio, avatar URL) with RLS so each user sees only their own row
   - `public.user_state` (streak, mastered topics, recently viewed, compiler drafts) with the same RLS
   - The public `avatars` storage bucket with owner-only write policies
   - The `delete_my_account()` RPC for self-service account deletion
4. Configure redirect URLs and (optionally) custom email sender — see [Email verification](#email-verification) below.
5. Add your env vars to `.env.local` and restart `npm run dev`.

If `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are missing or invalid, the app shows a setup notice on launch.

## Email verification

When a user signs up, Supabase sends a confirmation email. The link in that email points to whatever you configure as the **Site URL** in the Supabase dashboard.

**Configure:** *Authentication → URL Configuration*

| Field | Value |
|---|---|
| Site URL | Your deployed URL — for this project: `https://alihasanli.com` |
| Redirect URLs | Add every URL Supabase should be willing to redirect to. Example: `https://alihasanli.com/`, `https://alihasanli.com/**`, `https://www.alihasanli.com/`, `http://localhost:5173/`. |

The client passes `emailRedirectTo: ${window.location.origin}/` to `supabase.auth.signUp`, so the confirmation link always points back to wherever the user signed up — you just have to allow-list those URLs.

## Custom email sender (Resend)

By default Supabase emails come from a generic `noreply@mail.app.supabase.io` address, rate-limited to a handful of emails per hour. This project sends authenticated transactional email through [Resend](https://resend.com) on the free tier (100 emails / day) so all auth emails arrive from `noreply@alihasanli.com` with proper DKIM, SPF, and DMARC.

### One-time setup

1. **Create a Resend account** at <https://resend.com> (free).
2. **Add `alihasanli.com` as a verified sending domain** under *Domains → Add Domain*. Resend will display four DNS records: DKIM (TXT), MX (under the `send` subdomain), SPF (TXT under `send`), and DMARC (TXT under `_dmarc`).
3. **Add those four records to your DNS provider** (in this project: Vercel-fronted but DNS still managed at the Netlify registrar — alternatively, add to Cloudflare or wherever the domain's nameservers point). Click *Verify DNS Records* in Resend; verification typically takes < 2 minutes.
4. **Generate an API key** under *API keys → Create API Key* (full or sending-only scope).
5. **Plug it into Supabase** under *Authentication → SMTP Settings*:

   | Field | Value |
   |---|---|
   | Sender email | `noreply@alihasanli.com` |
   | Sender name | `Technical Resource Hub` |
   | Host | `smtp.resend.com` |
   | Port | `465` (or `587`) |
   | Username | `resend` |
   | Password | the API key starting with `re_…` |

6. Toggle *Enable Custom SMTP* on, save.

### Why Resend instead of Gmail SMTP

This project originally used Gmail SMTP. Gmail-as-sender works but Gmail flags the resulting auth emails as "this message might be dangerous" because the sender domain (`gmail.com`) doesn't match the link domain (`alihasanli.com`) and there's no SPF/DKIM/DMARC chain authorizing the cross-domain claim. Resend solves all three: emails come from `alihasanli.com`, the records are at `alihasanli.com`, the cryptographic chain checks out.

## Online Compiler (Judge0)

The compiler hits the public Judge0 CE endpoint at `https://ce.judge0.com`. No API key required for basic use. Supports Java (language id 62), Python 3 (71), and C++ (54) out of the box.

The free public endpoint is rate-limited and occasionally slow. For higher throughput and reliability, sign up at [rapidapi.com](https://rapidapi.com) for the Judge0 CE proxy and set the following env vars in your hosting platform (Vercel → Environment Variables):

```env
VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_HOST=judge0-ce.p.rapidapi.com
VITE_JUDGE0_KEY=<your-rapidapi-key>
```

The client refuses to call any non-HTTPS Judge0 endpoint.

> Earlier this project briefly used [Piston](https://github.com/engineer-man/piston). On 2026-02-15 Piston's public emkc.org endpoint went whitelist-only, returning HTTP 401 to unauthenticated callers. The Piston client (`src/api/piston.js`) is kept in the repo for use against a self-hosted Piston instance — swap one import in `CodeCompiler.jsx` to re-enable it.

## Security model

Briefly:

- **Passwords** are never stored in this codebase. Supabase hashes server-side and never returns plaintext.
- **Sessions** are JWTs in localStorage, auto-refreshed by `supabase-js`, and revoked on logout.
- **RLS** policies on `profiles`, `user_state`, and `storage.objects` mean users can physically only read or modify their own data. The anon key shipping in the client bundle is harmless because RLS is the gate.
- **Account deletion** uses a `SECURITY DEFINER` Postgres function that checks `auth.uid()` so it can only ever delete the calling user.
- **Avatar uploads** are size-limited (2 MB), extension-limited (jpg / png / gif / webp), and magic-byte verified — the file's actual first bytes must match the claimed MIME, otherwise the upload is rejected before reaching Storage.
- **Code submitted to Judge0** is length-capped (10 000 chars), the endpoint is HTTPS-only enforced in code, and stdin is capped at 4 000 chars.
- **No `dangerouslySetInnerHTML`** anywhere. React's default escaping prevents XSS via state. A `sanitizeText` helper additionally strips ASCII control characters before persisting user-typed text.

## Roadmap

- [ ] Google OAuth sign-in (one-click, no password to phish)
- [ ] hCaptcha on signup to block bot accounts
- [ ] Real test suite (Vitest) — start with `security.js`
- [ ] PR-grade CI: Vercel deploy preview + Lighthouse budget check
- [ ] Public profile pages (read-only, share your streak)
- [ ] Topic-mastery export to PDF for tutors

## License

[MIT](LICENSE) © Ali Hasanli — feel free to learn from this, fork it, and build your own.

## Acknowledgements

Built with the documentation and free tiers of [Supabase](https://supabase.com), [Judge0](https://judge0.com), [Resend](https://resend.com), and [Vercel](https://vercel.com). Icons by [lucide](https://lucide.dev). Fonts by [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/).
