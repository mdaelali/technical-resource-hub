# Changelog

All notable changes to Technical Resource Hub.

## v0.8 — Infrastructure overhaul + developer experience
- **Hosting migrated from Netlify to Vercel.** Netlify free tier paused the site mid-day after hitting its credit limit; Vercel was wired up via CNAME-only DNS in 15 minutes so `alihasanli.com` came back online the same hour. Cloudflare Workers deployment also exists at `*.workers.dev` as a backup.
- **Online Compiler runtime: Judge0 → Piston → back to Judge0.** Briefly swapped to [Piston](https://github.com/engineer-man/piston) for speed and zero-setup, then reverted to Judge0 the same day when Piston's public emkc.org endpoint went whitelist-only (HTTP 401, dated 2026-02-15). `piston.js` is kept in the repo for use against a self-hosted Piston instance — one import line in `CodeCompiler.jsx` switches between the two.
- **Transactional email moved from Gmail SMTP to [Resend](https://resend.com).** Auth emails now send from `noreply@alihasanli.com` with DKIM + SPF + DMARC verified. Default Supabase reset-password template replaced with a styled HTML version that survives spam filters.
- **Code editor improvements:**
  - Enter now auto-indents to match the current line's leading whitespace; pressing Enter just after `{`, `[`, or `(` adds a deeper indent; pressing Enter between an opener and its matching closer splits the block.
  - Typing `{`, `[`, `(`, `"`, or `'` auto-inserts the matching closer and parks the cursor between them. Typing a closer that already exists at the cursor steps over it instead of duplicating. Backspace between a matched pair deletes both.
  - Tab inserts 4 spaces (unchanged). Backspace at the end of a pure-whitespace indent removes 4 spaces in one keystroke.

## v0.7 — Auth hardening + UI polish
- Password reset flow: "Forgot password?" link → email → one-time recovery link → new-password form with strength meter, then forced sign-in.
- Account deletion: Danger Zone on the Profile page + `delete_my_account()` Postgres function (`SECURITY DEFINER`, scoped to `auth.uid()`) that cascades to `profiles`, `user_state`, and the user's `avatars` folder.
- Avatar upload: magic-byte sniffing (`FF D8 FF`, `89 50 4E 47`, `RIFF…WEBP`) replaces extension-trust; old avatar files are cleaned up after every successful new upload.
- Study Reminders dropdown is now solid (`rgba(7, 11, 26, 0.96)` + `blur(24px) saturate(140%)`) instead of see-through — readable on mobile against bright dashboard cards.
- "Read more" hint in Profile empty state is now a real button that navigates to Documentation.
- Dashboard's "Binary Search" name is clickable and opens the matching playground snippet.

## v0.6 — Real backend (Supabase)
- Replaced localStorage-only auth with Supabase email/password (bcrypt server-side).
- New `profiles` and `user_state` tables with row-level security so users can physically only see / write their own data.
- Avatars now upload to Supabase Storage; the profile holds a public URL instead of a base64 blob.
- `RemoteSync` component pulls cloud state on login (seeds the per-user localStorage cache) and pushes a debounced snapshot back on change.
- Email verification + custom Gmail SMTP wired up and documented.

## v0.5 — Performance pass
- Lazy-loaded the four heavy sections (Documentation, Playground, Compiler, Profile) → each is its own Rollup chunk.
- Replaced framer-motion `whileHover` on every card with a single `.card-hover` CSS class.
- Module-level cache layer on top of localStorage so multiple components reading the same key parse JSON once.
- `useReducedMotion` hook + `MotionConfig reducedMotion="user"` propagate the OS preference everywhere.
- Mobile: dropped `background-attachment: fixed`, downgraded `backdrop-blur` on `< md`, smaller dot-pattern radius.

## v0.4 — Browser history + lightbox
- Hash routing: every section now has a real URL (`#/dashboard`, `#/docs/algorithms`, `#/playground/binary-search`, …). Browser back/forward buttons walk the visited stack.
- Profile picture lightbox: clicking the avatar opens a full-screen preview; click-outside or Esc closes.

## v0.3 — Online Compiler + auto-streak
- Editable code editor with custom Java / Python / C++ syntax highlight via textarea-overlay technique.
- Judge0 integration: Run button submits source as base64, surfaces stdout / stderr / compile_output separately.
- Auto-streak system replaces the manual "Log Session" button: streak advances when the user reads a topic, marks one mastered, runs code, or dwells 2 minutes on a page.

## v0.2 — Content + design
- 18 hand-written documentation cards: 6 each for Algorithms, Logic Problems, Exam Prep — with complexity, examples, key concepts, step-by-step solutions, common mistakes, and practice tips.
- 11 reference Java snippets in Allman style with expected stdout previews.
- Premium stat widgets (gradient backgrounds, soft blurred halos, `bg-clip-text` numbers).
- Student-ID card layout for the Profile page (holographic header strip, embedded avatar, member-since field).

## v0.1 — Initial scaffold
- Vite + React + Tailwind project, dark glassmorphism theme.
- Six-section layout (Dashboard, Documentation, Code Playground, Progress, Profile) with sidebar + topbar shell.
- Responsive: sidebar collapses into a slide-in drawer below `md`, every grid stacks to one column on `< sm`.
