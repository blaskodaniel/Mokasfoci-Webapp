# Mokasfoci Web — FM26 gamified redesign (in progress)

## Status

- **Branch:** `design/fm26-inspired-ui` (pushed to `origin`, no PR opened yet — deliberately, per user request, keep working on the branch until told otherwise).
- **Goal:** restyle the player-facing web app (React 19 + Vite + TS + Tailwind v4 + framer-motion) into a dark, gamified "Football Manager 26" look, page by page. Backend (`api`) and admin panel (`admin`) are out of scope.
- Work happens incrementally: pick a page/component, redesign it, verify live (see "Verifying changes" below), get user sign-off, move to the next one. Don't do a big-bang rewrite of untouched pages without being asked.

## Design system (already built — reuse, don't reinvent)

All tokens live in `src/index.css` under `@theme`:
- Backgrounds: `--color-primary/secondary/tertiary/quaternary`, `--color-bg-gradient` (page bg).
- Tile/card system (the core FM26 visual language): `--tile-bg-gradient`, `--color-tile-border`, `--color-tile-border-hover`, `--radius-tile` (→ `rounded-tile` utility), `--shadow-tile` / `--shadow-tile-hover`.
- Gradient CTA: `--gradient-cta` / `--gradient-cta-hover` (purple→pink) — apply via arbitrary value, e.g. `bg-[image:var(--gradient-cta)]`.
- Text: `--color-text-primary/secondary/muted`.
- Accents: `--color-accent`, `--color-accent-soft`, `--color-highlight`.
- Badges: `--color-badge-live(-bg/-border)` (red), `--color-badge-amber(-bg/-border)`, `--color-badge-success(-bg/-border)`.
- Custom breakpoint: `--breakpoint-nav: 1390px` → `nav:` variant, used by the header to switch from icon-only to icon+label nav.

Shared primitives (`src/components/ui/`): `Tile.tsx` (FM26 card, replaces ad hoc panels), `Badge.tsx`, `AuthCard.tsx` / `AuthInput.tsx` (auth pages). `src/components/Button.tsx` has a `variant` prop (`cta`/`secondary`/`ghost`/`danger`, via `class-variance-authority`) — **optional and backward-compatible**: omit `variant` to get the old raw-className behavior (many old call sites still do this; don't assume every `<Button>` uses `variant`).

Favorite-team indicator: a gold star (`IoStar`, `text-badge-amber`), not a heart — see `src/components/Matches/FavoriteTeamBadge.tsx` (variants: `"pill"` = flag + corner star, for places with no flag shown yet; `"star"` = bare icon, for overlaying on a flag that's already rendered elsewhere, e.g. `MyBets/OutcomeBetCard.tsx`). Reuse this everywhere the app marks "your favorite team is involved" — don't reintroduce `MdFavorite`/hearts.

## Redesigned so far

- **Header** (`src/components/Header.tsx`) — icon nav (labels only above 1390px), avatar/points chip, scroll-shrink via padding (not height, see gotcha below).
- **Home** (`src/pages/Home.tsx` + `WelcomePanel`, `MatchCard`, `ToplistWidget`) — portal-style tile grid.
- **MyBets** (`src/pages/MyBets.tsx` + `components/MyBets/*`) — desktop: proportional-width table (`Mérkőzés`/`Kimenetel` get more `fr`, others share the rest, actions column is narrow, `Kimenetel` shows a flag), combined Nyeremény+Profit column, fancy odds chips. Card view (not the dense table) is used for **both mobile and tablet** (`isMobile || isTablet`, i.e. below `lg`/1024px) — the 9-column table only fits genuine desktop widths.
- **Matches** (`src/pages/Matches.tsx` + `OddsCell.tsx`) — same fancy odds chips, two-line "Saját fogadás" column with flag, redesigned `Calendar` (`src/components/Calendar/`: tile card on desktop, full-bleed + sticky on mobile with an explicit "Mind" (all matches) toggle pill, larger touch targets for the week-nav arrows).
- **Auth pages** (Login/Register/ForgotPassword/ResetPassword) — `AuthCard`/`AuthInput`, full-screen non-card layout on mobile, centered card on desktop. No logo (removed per user request — don't re-add one).
- **BetModal** (`src/components/BetModal/*` + `src/components/Modal.tsx`) — hero header with big flags + gradient "VS" badge, gradient pill tabs, tile-style outcome selector, sticky (not fixed) CTA footer, wider on desktop (560px). `AdvancementBetModule.tsx` in that folder is **dead code** — not wired into any tab, disabled "under development" button. Flag it to the user before touching it; don't assume it should be redesigned too.

## Not yet redesigned

Everything else: `MyProfile`, `Toplist`, `GroupTables`, `GroupDetail`, `TeamDetail`, `Bracket`, `Statistics`, `MyBadges`, `Notifications`, `MatchDetail`, `NotFound`, `MobileMenu`, chat widget, popups. Old raw-Tailwind styling (grays/blues/greens, no tokens) there is expected — that's just "not done yet," not a bug.

## Gotchas fixed this round — don't reintroduce them

1. **`overflow-y-auto` on the `Layout.tsx` root div silently breaks `position: sticky` app-wide.** It never actually scrolled anything itself (content height always matched the box), but per spec it still counts as establishing a scroll container, so every sticky descendant computed its "stuck" offset against it instead of the viewport. Fixed by removing that class. If sticky ever seems to stop working somewhere, check for a stray `overflow` on an ancestor before assuming the sticky code itself is wrong.
2. **`position: fixed` inside an element with a live CSS `transform` doesn't stick to the viewport — it sticks to that transformed ancestor instead.** `Modal.tsx`'s panel always carries `transform: scale(...)` from framer-motion while mounted. Any `fixed` element inside it (e.g. the old bottom CTA bars in `OutcomeBetModule`/`ScoreBetModule`) visibly jumps every frame while the panel animates. Fix: use `sticky bottom-0` inside a scrollable ancestor instead of `fixed`, never `fixed` inside anything that framer-motion might transform.
3. **`backdrop-filter` (`backdrop-blur-*`) on an element nested inside an animating-transform ancestor causes a visible flicker/flash in Chromium** during the transform animation (browser has to recompute the backdrop snapshot every frame). Removed `backdrop-blur-sm` from `Modal.tsx`'s close button for this reason. Avoid adding `backdrop-blur` to anything that lives inside a `motion.div` that animates `scale`/`x`/`y`.
4. `Modal.tsx`'s scrollable body wrapper (`overflow-y-auto`) is applied unconditionally now (used to be `sm:`-only, meaning mobile modals had no real internal scroll mechanism for tall content). Keep it unconditional.

## Verifying changes (no visual tool access by default)

There's no way to "see" the rendered UI directly. What's worked this session:
- `npm run lint` + `npm run build` in `web/` after every change — catches type/syntax errors, not visual bugs.
- For actual visual verification: `admin/node_modules/playwright` is installed (Chromium already downloaded there) even though `web` itself has no Playwright dependency — a Node script requiring `C:/Develop/Mokasfoci-Workspace/admin/node_modules/playwright` works fine to screenshot `web`. Scratch scripts for this went in the session's scratchpad dir (not committed).
- **Test login for authenticated pages:** username `varga`, password `test` — a local dev-only seeded account on the `192.168.1.171` MongoDB instance. Has bets placed (including on Elefántcsontpart/Ivory Coast, its favorite team) — useful for exercising favorite-team styling, win/loss states, edit-mode, etc.
- The three dev servers (api :8000, admin :3000, web :5173) are not auto-started — start them with `npm run dev` in each directory if they're not already running (check with `netstat -ano` / the ports above before assuming they're down — a stray process from a previous session can already be squatting on a port).
