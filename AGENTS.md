# AGENTS.md

Guidance for AI agents (and humans) working in this repository.

## What this project is

The DSPLAY **Menu Board** template — a [React](https://reactjs.org/) app built with [Vite](https://vitejs.dev/) that lays out a JSON-driven menu (categories, items, prices, featured images) across 1-3 columns depending on screen orientation/size, auto-paginating when content overflows. Requires Node.js 22.22.2+, 24.15.0+, or 26+ (see `.nvmrc`). See README.md for the template's variables.

## Directory structure

```
index.html                 <-- Vite entry point
vite.config.js             <-- includes @dsplay/template-manifest's Vite plugin (see below)
public/
  dsplay-data.js            <-- mock DSPLAY data for local development
  test-assets/              <-- dev-only assets (real customer menu examples), excluded from the release build
src/
  index.jsx                  <-- React entry point
  setup-tests.js              <-- Vitest setup (referenced by vite.config.js)
  utils/utils.js               <-- pagination/layout engine: turns media.result.data into pages of column items
  hooks/use-interval.js        <-- setInterval hook driving page auto-rotation
  contexts/styles-context/     <-- reads all the color/style template variables once, provides them via context
  components/
    app/                        <-- top-level component, imports bootstrap (real npm package) + menu.sass
    container/                  <-- reads media/template vars, builds pages, rotates through them
    menu-board/                 <-- lays out one page's up-to-3 columns + the brand/ad box
    column/                     <-- renders one column's items (category/spacer/pricesHead/featuredImage/item)
    item/, section-title/, prices-head/, featured-image/, spacer/  <-- individual row/widget types
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of (`src/assets/fonts/`).
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Column from '../column'`, never `.../column/index`.
- Non-component modules (context, hooks, utils) live outside `components/` in their own top-level folder, following the same folder+`index.jsx` convention only when they export a component (e.g. `contexts/styles-context/index.jsx` provides `StylesContext` and its `useStyles()` hook) — plain `.js` files elsewhere don't need it.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.
- `src/assets/styles/menu.sass` was converted from `menu.css` (mechanical CSS→indented-syntax rewrite, verified with `sass` to compile to identical CSS) to comply with the sass-only rule above — it's our own hand-authored layout/font-face stylesheet. Bootstrap (see Dependency management below) is a real npm package now, not a vendored file, so it isn't subject to this rule at all.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see [`template-boilerplate-react`](https://github.com/dsplay/template-boilerplate-react)'s AGENTS.md for the full convention. This template's is `dsplay-template-menuboard`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through [`@dsplay/react-template-utils`](https://github.com/dsplay/react-template-utils)'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call [`@dsplay/template-utils`](https://github.com/dsplay/template-utils)'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- **New `dsplay_template` variable keys should use `snake_case`** (e.g. `background_color`, not `backgroundColor`) — the DSPLAY CMS Manager auto-generates each variable's on-screen label from its key name, and snake_case reads more naturally there. This only applies to variables added from now on — never rename this template's existing keys just to match (many of them, like `screenSize`/`backgroundImage`/`showPartials`, are already registered/in use in production CMS configurations).
- This template used to read variables directly from `@dsplay/template-utils`'s vanilla exports at **module scope** (in `contexts/styles-context/index.jsx` and `components/container/index.jsx`) — migrated to hooks. `contexts/styles-context/index.jsx` now exports a `useStyles()` hook (called from `Container`, whose result is passed into `StylesContext.Provider`) instead of a module-level `styles` constant. `utils/utils.js`'s pure pagination functions (`createPages`, `parseFeaturedImage`, `getCategoryUsageCount`) can't call hooks themselves (they're plain functions, not components) — `debug` and the raw `template` object are now passed in as parameters (via `createPages`'s `options` argument) from `Container`, which reads them with `useTemplateBoolVal('debug')`/`useTemplate()`. `utils.js`'s module-level `log()` became a `createLog(debug)` factory for the same reason — `createPages` builds its own `log` closure from the `debug` param at the top of the function instead of reading a module-level constant.
- `logo` (`menu-board/index.jsx`), `currencySymbol`/`currencyMaxCols` (`item/index.jsx`), and `image1`..`image15` (dynamically, as `template['image' + n]`, from `utils/utils.js`'s `parseFeaturedImage`) are all read via direct property access on the object returned by `useTemplate()`, rather than `useTemplateVal()` — [`@dsplay/template-manifest`](https://github.com/dsplay/template-manifest)'s static scanner only recognizes `tval`/`useTemplateVal`-style calls, so none of these show up in the generated manifest. They're documented manually in the README's variable table instead.
- `debug` (`useTemplateBoolVal('debug')`, read in `Container`) gates all `console.log` diagnostic output in `utils/utils.js` — it's an internal debug switch, not currently registered as a CMS Template Var (intentionally; not meant for end users).
- `media.result.data.categories` is the actual menu content (see `public/dsplay-data.js` for the expected shape: each category has `cod`/`title`/`priceTitles`/`items`, each item has `num`/`title`/`description`/`price1`.. Special `num` values `/cb` (column break), `/pb` (page break), `/n` (blank line), `/fi(n[,size])` (featured image), `/li(n[,size])` (layout image, undecorated) drive layout — see `utils/utils.js`'s `createPages`.

### Fixed: `dsplay-data.js` was ~1000 lines of dead code, with the live example's images broken

Before this fix, `dsplay_media` was declared with a full ~940-line "Petiscos/Crepes/Frutos do Mar/..." menu as its `result`, which was then **immediately overwritten** two lines later by a separate `dsplay_media.result = {...}` assignment (a completely different "Esfihas/Salgados/..." menu) — the entire first menu was unreachable dead code. That reassignment was followed by three more large commented-out `dsplay_media.result = {...}` blocks (alternate example restaurants: delicatessen-são-josé, mr burguer, bouca louca). `dsplay_template` had the same pattern: a chain of commented-out per-restaurant blocks (delicatessen-são-josé, fiorentina, boca louka, a praça, mr-burguer), with only the last one ("casa da esfiha") actually live. Collapsed all of this down to the single live `dsplay_media`/`dsplay_template` declaration (~1053 lines → ~38).

The live "casa da esfiha" block's `logo`/`backgroundImage`/`image1`..`image9` all pointed at `../test-assets/casa-esfiha/...` — broken in the DSPLAY CMS preview for the same reason documented in `template-boilerplate-react`'s AGENTS.md (that folder is excluded from the production build). Replaced with a `ui-avatars.com` placeholder logo and real Wikimedia Commons food photos (esfihas, pizza, juice, banana split, a sweet-pastry substitute, picanha, salmon, wine, and a pitcher substitute for the juice jug — no exact "esfiha doce"/juice-pitcher photos were found on Commons). `backgroundOpacity: .0000001` is not a bug and wasn't touched — it controls a dominant-color-extracted overlay *tint* (`contexts/styles-context/index.jsx`), not the background image's own opacity, so a near-zero value means "show the photo at full clarity, no tint," which is exactly what renders.

`public/test-assets/` (every image for the deleted dead restaurant blocks, plus the `casa-esfiha/` originals now replaced above — all fully orphaned) was removed entirely, including `casa-esfiha/Recibo_1848_junho_2020.PDF`, an unrelated, real-looking receipt PDF that had been sitting in that folder since commit `974d050`, never referenced by any code. Confirmed with the maintainer before removing it.

## Template variable manifest

`vite.config.js` registers `@dsplay/template-manifest`'s Vite plugin, which on every build statically scans `src/` for `tval`/`useTemplateVal`-style reads and captures `public/dsplay-data.js` as example data, writing `template-variables.json` + `template-example-data.json` into the build output — and therefore into `template.zip` (`npm run zip` runs `build.sh`, which zips the whole build output). The DSPLAY CMS reads these two files to auto-detect a template's variables and seed default preview values, instead of requiring manual registration. See [@dsplay/template-manifest](https://www.npmjs.com/package/@dsplay/template-manifest) for exactly what it detects — note the `image1`..`image15` caveat above, those need manual CMS registration since the scanner can't see them.

## Commands

- `npm start` — dev server (Vite).
- `npm run build` — production build (runs the linter first via the `prebuild` script).
- `npm test` / `npm run test:watch` — Vitest.
- `npm run linter` / `npm run linter:fix` — ESLint on `src`.
- `npm run zip` — builds, then runs `build.sh` to produce `template.zip` ready for the [DSPLAY Web Manager](https://manager.dsplay.tv/template/create). `build/` and `template.zip` are gitignored.

## Dependency management

Regular npm dependencies, not vendored files — `npm outdated` / `npm update` for in-range bumps. For an out-of-range (typically major) bump, apply it deliberately and verify `npm start`, `npm run build`, and `npm test` still work before committing.

### Fixed: Bootstrap was a hand-vendored, unversioned Bootstrap 3.3.7 copy from 2016

> Bootstrap was later removed from this project entirely — see the last subsection below. The `bootstrap` npm package mentioned here no longer exists in `package.json`; this subsection is kept for history since the swap below (v3.3.7 → npm `^5.3.8`) is what surfaced the next three fixes.

`src/assets/styles/bootstrap/` used to hold a manually-downloaded `bootstrap.min.css` (v3.3.7) plus Glyphicons webfont files, imported directly by path from `app/index.jsx`. Two problems: it was frozen at a 2016 release with no way to update it short of re-downloading files by hand, and its minified CSS referenced a `bootstrap.min.css.map` that was never actually included, so Vite's dev server logged a `Failed to load source map` / `ENOENT` error on every request (harmless — it only broke "jump to original source" in devtools for that one vendored file, not the app itself).

Replaced with the real `bootstrap` npm package (`^5.3.8`) — `app/index.jsx` now does `import 'bootstrap/dist/css/bootstrap.min.css';`, and the vendored folder plus its Glyphicons fonts were deleted (Glyphicons were dead weight regardless: grepping `src/**/*.jsx` for `glyphicon` turns up zero usages, and Bootstrap dropped Glyphicons entirely starting in v4). The npm package ships its own correct source map, so the console error is gone.

This is a major-version jump (v3 → v5) for a template that genuinely uses Bootstrap's grid (`.container`/`.row`/`.col-md-*`) and `.jumbotron` (`menu-board/index.jsx`) — v4 switched the grid from float-based to flexbox, and v5 removed the `.jumbotron` component's CSS entirely. A live before/after browser comparison (same "Casa da Esfiha" mock data) at a ~1568px window confirmed the rendered layout was pixel-for-pixel the same there — but see the next section for two more Bootstrap v3→v5 default changes that *do* surface at other window sizes, found only after re-testing at a wider resolution.

### Fixed: Bootstrap 5's wider `.container` breakpoints and 16px base font-size made every `em`-based size in this template bigger, causing real overlap at wide window sizes

The "pixel-for-pixel identical" check above only holds below Bootstrap 5's `lg`/`xl`/`xxl` breakpoints. Two of Bootstrap 3→5's *deliberate* default changes matter a lot here because this template's `menu.sass` is entirely `em`-based (`.ad-box-N` heights, margins, font sizes — everything cascades from `body`'s font-size and `.container`'s width):

1. **`body`'s base font-size**: Bootstrap 3 set it to a fixed `14px`; Bootstrap 4+ (including 5) changed the default to `1rem` (16px). That's a ~14.3% size increase propagating through every `em` value in the whole template.
2. **`.container`'s max-width breakpoints**: Bootstrap 3 topped out at `max-width: 1170px` for any screen ≥1200px, with no further tier. Bootstrap 5 added a new `xxl` tier (≥1400px) at `max-width: 1320px` — 150px wider than Bootstrap 3 ever provided, at exactly the window sizes (like a 1854px-wide screenshot) where this surfaced during testing.

### Fixed: `.brand-box`'s rounded corners disappeared along with `.jumbotron`

`menu-board/index.jsx`'s logo box has `className="jumbotron brand-box"` — `.jumbotron` was always a *real* Bootstrap class (not a made-up name), and Bootstrap 3's own `.jumbotron` CSS included `border-radius: 6px` (at the ≥768px breakpoint) that this template's own `menu.sass` never redefined — it was "free" styling riding on Bootstrap being present. Bootstrap 5 deleted the `.jumbotron` component's CSS entirely (same fact noted above, this is the concrete visual consequence of it), so the corners silently went sharp. `.brand-box`'s own margin/padding/background-color rules were already complete overrides of Bootstrap 3's other `.jumbotron` defaults (e.g. `margin: 1em 4em 0em` already explicitly zeroes out the bottom margin that Bootstrap 3's base `.jumbotron` rule set to `30px`), so `border-radius` was the *only* property actually lost — added explicitly to `.brand-box` now. If any other element in this template ever gets a bare `jumbotron`/other now-meaningless Bootstrap class name added to it, check what Bootstrap 3 used to provide for it the same way before assuming `.brand-box`-style app classes cover everything.

This template's fixed "items per column" layout math (`utils/utils.js`'s `getMaxItemsForColumn`, and the hardcoded `/fi(n,size)` featured-image markers baked into `public/dsplay-data.js`'s mock menu, e.g. `/fi(3, 8)` in "Bebidas") was tuned against Bootstrap 3's narrower, smaller-base-font-size container — so both of these Bootstrap 5 defaults combined to make text and images measurably bigger at wide window sizes, causing the featured image to visually overlap the price row above it. Confirmed via direct DOM measurement (not just screenshots, since a ~1s per-category crossfade animation makes screenshot timing unreliable) that this was a *real*, reproducible, non-transitional layout difference — not a false alarm.

Fixed both in `menu.sass`, right after the existing `.container` rule:
```sass
body
  font-size: 14px

@media (min-width: 768px)
  .container
    max-width: 750px
@media (min-width: 992px)
  .container
    max-width: 970px
@media (min-width: 1200px)
  .container
    max-width: 1170px
```
Verified via direct comparison against the original Bootstrap 3 build (git worktree at the pre-upgrade commit) at the exact window size (1854×927) where the bug was reported: `body`/`.container` computed font-size, `.row` width, and item title font-size are now byte-identical between old and new (14px / 1170px / 18.2px in both), and the featured-image `.ad-box` no longer overlaps the row above it. If `menu.sass`'s Bootstrap-class overrides are ever changed, re-verify at a window width ≥1400px specifically — that's where Bootstrap 5's extra `xxl` breakpoint diverges from Bootstrap 3's behavior, and where this regression was invisible at smaller test resolutions.

### Fixed: `.brand-box` (and every other unclassed `.row` child) stretched to 100% width and overflowed into the next column

After the two fixes above, the logo box (`.brand-box`, a plain unclassed child of `<div className="row brand-container">`) still rendered too wide and shifted right, overlapping the second column. Root-caused via side-by-side `getComputedStyle`/`getBoundingClientRect` comparison (not screenshots — see the note in the previous section about why) between a git worktree at the pre-upgrade commit and the current tree, both built with `npm run build` (not `npm run zip`, which blanks `public/dsplay-data.js` to a placeholder and crashes `npm run preview` with no mock data) and served via `npm run preview` at the exact reported window size:

- Old (Bootstrap 3): `.brand-box` rect `l=398 r=871 w=473`, `.brand-container` `display: block`.
- New (Bootstrap 5, pre-fix): `.brand-box` rect `l=398 r=983 w=585` — 112px wider (exactly 2× the box's own `4em`/56px side margins), overflowing 56px into the next column.

Two independent Bootstrap 3→5 grid changes combine to cause this:

1. **`.row` became `display: flex`** (Bootstrap 3's was plain `display: block`, float-cleared columns). This activates `.brand-box`'s own pre-existing `flex-grow: 1` — under Bootstrap 3 this property was always inert (it only takes effect inside a real flex container), so it was safe to leave in `.brand-box`'s CSS for a decade.
2. **Bootstrap 5 added a `.row > *` rule** (absent from Bootstrap 3) that force-sets `width: 100%` (plus grid-gutter padding and `margin-top`) on *every* direct child of `.row`, not just `.col-*` children. Verified this is sufficient on its own: forcing `.brand-box`'s `flex-grow` to `0` and its `display` to `block` directly in devtools did *not* change its rendered width — only removing `.row > *`'s `width: 100%` did.

Since this template's whole layout (`menu-board`, `section-title`, `featured-image`, `item`, `prices-head` — every one of them uses `.row`/`.col-md-4`/`.col-md-6`/`.col-md-12`) was built against Bootstrap 3's float engine, the fix restores that engine wholesale in `menu.sass` rather than patching `.brand-box` in isolation (extracted byte-for-byte from `git show <pre-upgrade-commit>:src/assets/styles/bootstrap/css/bootstrap.min.css`):
```sass
.row
  display: block
  margin-right: -15px
  margin-left: -15px

.row > *
  width: auto
  max-width: none
  padding-right: 0
  padding-left: 0
  margin-top: 0

@media (min-width: 992px)
  .col-md-4, .col-md-6, .col-md-12
    position: relative
    min-height: 1px
    padding-right: 15px
    padding-left: 15px
  .col-md-4, .col-md-6
    float: left
  .col-md-4
    width: 33.33333333%
  .col-md-6
    width: 50%
  .col-md-12
    width: 100%
```
Also restored `.container`'s `padding-right`/`padding-left: 15px` (Bootstrap 3's fixed value at every breakpoint) — Bootstrap 5 derives this from a `--bs-gutter-x` custom property instead, which no longer resolves to the same pixel value once `body`'s font-size is restored to `14px` above, throwing every child's left offset off by a few px.

Verified via the same exact-measurement approach: `.brand-box` rect is now `l=398 r=871 w=473` — byte-identical to the Bootstrap 3 baseline — and both `.col-md-6` columns split cleanly at `342/927/1512` with zero overlap. Re-checked visually too, including the "Bebidas" category specifically (the one from the earlier `.container`-breakpoint bug) to confirm the featured-image column still doesn't overlap.

If `.row`/`.col-md-*` CSS is ever touched again, re-verify with exact DOM measurements (not screenshots — the per-category crossfade animation makes screenshot timing unreliable) on every `.row`-based component listed above, not just `.brand-box`.

### Fixed: Bootstrap removed entirely — this template never used enough of it to justify the dependency

After the three fixes above, an audit of actual usage (`grep -rohE "className=\"[^"]*\"" src --include="*.jsx"`, plus a scan for every HTML tag used) found this template only ever touched five Bootstrap primitives — `.container`, `.row`, `.col-md-4`/`.col-md-6`/`.col-md-12`, and one `.jumbotron` — out of Bootstrap's entire ~228KB stylesheet. No buttons, forms, navbar, cards, or utility classes; every other visible class (`.tableItem`, `.priceHead`, `.ad-box-N`, `.flag`, etc.) was already custom CSS in `menu.sass`. Since three consecutive major-version-bump regressions had already been traced back to Bootstrap defaults changing under this template's feet, and all five primitives it actually used were already fully re-implemented in `menu.sass` by the fixes above, the dependency itself was removed rather than kept as 228KB of unused CSS with more upgrade risk baked in.

Removed `bootstrap` from `package.json` (`npm uninstall bootstrap`) and its `import 'bootstrap/dist/css/bootstrap.min.css';` from `app/index.jsx`. Bootstrap wasn't just supplying the grid — it was also silently supplying baseline browser resets this template depended on without ever declaring them itself. Removing it clean required auditing which reset rules were actually load-bearing (checked against every HTML tag this app actually renders: `div`, `span`, `table`, `tbody`, `tr`, `td`, `hr` — no headings, lists, images, links, or form controls anywhere in `src/**/*.jsx`) and adding them explicitly to `menu.sass`:
```sass
*, *::before, *::after
  box-sizing: border-box

hr
  box-sizing: content-box
  border: 0
  border-top: 1px solid #eee

table
  border-spacing: 0
  border-collapse: collapse
  background-color: transparent

body
  margin: 0
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif
  line-height: 1.42857143
  color: #333
```
Two more Bootstrap defaults turned out to be load-bearing and were missing from the grid restoration above (only surfaced once Bootstrap's CSS was gone entirely and couldn't paper over them anymore — caught via the same worktree DOM-measurement comparison, not by inspection):
1. **`.container` centering**: Bootstrap's own base `.container` rule always included `margin-right: auto; margin-left: auto`. `menu.sass` never declared this itself (it only overrode padding/max-width), so once Bootstrap's rule was gone the container collapsed to the left edge (`l=0` instead of `l=342` at the tested window size). Added `margin-right: auto; margin-left: auto` to `.container` in `menu.sass`.
2. **`.row` clearfix**: Bootstrap's `.row` includes a clearfix (`&::before, &::after { content: " "; display: table } &::after { clear: both }`) to contain its floated `.col-md-*` children — without it, a `.row` with only floated children collapses to zero height. Added the same clearfix to `.row` in `menu.sass`.

`.jumbotron` is kept as a plain class name in `menu.sass` and in `menu-board/index.jsx`'s `className="jumbotron brand-box"` — it's no longer tied to an actual Bootstrap component, just a legacy name for an app-owned rule now, left as-is rather than renamed to avoid churn.

Verified via the same worktree-based exact-DOM-measurement approach as the fixes above: every measured selector (`.container`, `.row`, `.col-md-6`, `.col-md-12`, `.brand-box`, `.tableItem`, `.priceHead`, `.category`, `.currency`, `body`'s computed `margin`/`font-family`/`line-height`/`color`/`font-size`) is now byte-identical between the pre-Bootstrap-5-upgrade baseline and this Bootstrap-free build, at the same window size used throughout this saga. Also diffed the actual compiled CSS rules (not rendered instances, to sidestep the per-category rotation-timing pitfall noted above) for every component's classes and confirmed they're textually identical except for the intentionally-added `.brand-box` `border-radius: 6px` from the earlier fix. Total CSS bundle size dropped from ~241KB to ~5KB.

If any new feature ever needs an actual Bootstrap component (modals, forms, navbar, etc.), don't silently re-add the npm package — build it as custom CSS/JS matching this template's own conventions, the same way everything else here already is.

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
