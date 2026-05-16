<div align="center">

# Technical Resource Hub

**A focused study workspace for computer science students — documentation, a real online compiler, automatic streak tracking, and per-user progress that syncs across devices.**

🔗 **Live demo:** [techresourcehub.netlify.app](https://techresourcehub.netlify.app/)

[![Built with React](https://img.shields.io/badge/React-19-149eca?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20Auth%20%2B%20Storage-3ecf8e?logo=supabase&logoColor=white)](https://supabase.com/)
[![Judge0](https://img.shields.io/badge/Judge0-Online%20Compiler-ff7a45)](https://judge0.com/)
[![Netlify](https://img.shields.io/badge/Deployed-Netlify-00c7b7?logo=netlify&logoColor=white)](https://techresourcehub.netlify.app/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](#license)

</div>

---

## What it does

Resource Hub is a single-page study workspace built around four things students actually use:

- **Documentation Viewer** — 18 hand-written cards across *Algorithms*, *Logic Problems*, and *Exam Prep* with complexity analysis, common mistakes, step-by-step solutions, and practice tips.
- **Code Playground** — 11 reference Java snippets (Binary Search, Merge Sort, Two Sum, Stack, Tree Traversal, …) with a faux IDE chrome, custom syntax highlighting, and one-click expected-output preview.
- **Online Compiler** — a real editable code editor that compiles and runs **Java, Python, and C++** in the browser via the Judge0 API. Output, stderr, and compile errors are surfaced separately. Code length is capped and HTTPS-only.
- **Progress Tracker** — a dashboard with a study-streak counter that increments **automatically** when the student reads a topic, marks something as mastered, runs code, or dwells for 2 minutes on a page. No manual "log session" button.

Every user gets their own account (Supabase Auth), their own profile (name, bio, avatar uploaded to Supabase Storage), and their own progress — synced across devices.

## Screenshots

The fastest way to feel the app is the [live demo](https://techresourcehub.netlify.app/). What you'll see:

- **Dashboard** — time-of-day greeting, premium stat widgets for streak and mastery, six quick-access tiles, daily recommendation, tip of the day.
- **Documentation** — gradient-bordered topic cards with an expandable "Read more" surface that reveals step-by-step solutions, common mistakes, and practice tips.
- **Online Compiler** — multi-language editor with tab/indent, run via Judge0, separate panels for `stdout`, `stderr`, and `compile_output`, plus stdin support.
- **Profile** — student-ID card with holographic header strip, click-to-upload avatar, badges grid, recently viewed topics, and a Danger Zone for account deletion.

## Why I built this

> _**Fill this in — admissions readers care about story.** A short, honest paragraph about what problem you saw, what you tried, and what surprised you. Aim for 150–250 words. Suggested prompts:_
>
> - _What problem at school did this solve for you or your classmates?_
> - _What was the hardest single bug you fixed, and how?_
> - _What did you discover about software design that you didn't expect?_
> - _What would you do differently if you started over?_

## Highlights an interviewer might ask about

- **Real backend auth, not localStorage.** Supabase email-and-password with verified emails (custom Gmail SMTP), full password reset flow via one-time emailed link, account deletion via a `SECURITY DEFINER` Postgres function that an authenticated user can only invoke on their own row.
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
| Code execution | Judge0 CE | Sandboxed Java / Python / C++ runtime, base64-encoded payload, HTTPS-only |
| Icons | lucide-react | Tree-shakeable, per-icon imports |
| Hosting | Netlify | Auto-deploy on every `main` push, custom domain pending |

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
    judge0.js             code execution client, HTTPS-only
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
| Site URL | Your deployed URL — for this project: `https://techresourcehub.netlify.app` |
| Redirect URLs | Add every URL Supabase should be willing to redirect to. Example: `https://techresourcehub.netlify.app/`, `http://localhost:5173/`, plus your custom domain when you add it. |

The client passes `emailRedirectTo: ${window.location.origin}/` to `supabase.auth.signUp`, so the confirmation link always points back to wherever the user signed up — you just have to allow-list those URLs.

## Custom email sender (Gmail SMTP)

By default Supabase emails come from a generic `noreply@mail.app.supabase.io` address, throttled to a few per hour. To send from your own Gmail with a 500/day quota:

1. Enable **2-Step Verification** on your Google account.
2. Generate an **App Password** at <https://myaccount.google.com/apppasswords> (the regular Gmail password will be rejected by SMTP).
3. In Supabase: *Authentication → SMTP Settings* → toggle **Enable Custom SMTP** and fill in:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: your Gmail address
   - Password: the 16-character App Password (no spaces)
   - Sender email: your Gmail address

## Optional: Online Compiler (Judge0)

Defaults to the public `https://ce.judge0.com` endpoint. For higher quotas, sign up at [rapidapi.com](https://rapidapi.com) and set:

```env
VITE_JUDGE0_URL=https://judge0-ce.p.rapidapi.com
VITE_JUDGE0_HOST=judge0-ce.p.rapidapi.com
VITE_JUDGE0_KEY=<your-rapidapi-key>
```

The client refuses to call any non-HTTPS Judge0 endpoint.

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
- [ ] PR-grade CI: Netlify deploy preview + Lighthouse budget check
- [ ] Public profile pages (read-only, share your streak)
- [ ] Topic-mastery export to PDF for tutors

## License

[MIT](LICENSE) © Ali Hasanli — feel free to learn from this, fork it, and build your own.

## Acknowledgements

Built with the documentation and free tiers of [Supabase](https://supabase.com), [Judge0](https://judge0.com), and [Netlify](https://www.netlify.com). Icons by [lucide](https://lucide.dev). Fonts by [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/).
