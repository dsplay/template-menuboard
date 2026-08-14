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
    app/                        <-- top-level component, imports bootstrap.min.css (vendored) + menu.sass
    container/                  <-- reads media/template vars, builds pages, rotates through them
    menu-board/                 <-- lays out one page's up-to-3 columns + the brand/ad box
    column/                     <-- renders one column's items (category/spacer/pricesHead/featuredImage/item)
    item/, section-title/, prices-head/, featured-image/, spacer/  <-- individual row/widget types
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of (`src/assets/styles/bootstrap/`, `src/assets/fonts/`).
- **Author styles as `.sass` (indented syntax), never `.css`** — this applies to our own hand-authored stylesheets specifically; it does not apply to vendored or tool-generated CSS we don't hand-edit (a self-hosted Google Fonts `@font-face` file, a Flaticon/IcoMoon icon-font export, a vendored library like Bootstrap) — those stay `.css` since they'd be regenerated/replaced wholesale, not edited by hand. `.sass`'s indented syntax has no braces or semicolons — converting a `.css` file means rewriting it to the indented syntax, not just renaming it.
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Column from '../column'`, never `.../column/index`.
- Non-component modules (context, hooks, utils) live outside `components/` in their own top-level folder, following the same folder+`index.jsx` convention only when they export a component (e.g. `contexts/styles-context/index.jsx` provides `StylesContext` and its `useStyles()` hook) — plain `.js` files elsewhere don't need it.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.
- `src/assets/styles/menu.sass` was converted from `menu.css` (mechanical CSS→indented-syntax rewrite, verified with `sass` to compile to identical CSS) to comply with the sass-only rule above — it's our own hand-authored layout/font-face stylesheet, unlike the vendored `bootstrap/css/bootstrap.min.css` sitting right next to it, which stays `.css`.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-menuboard`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- **Always read template data through `@dsplay/react-template-utils`'s hooks (`useTemplateVal`/`useTemplateBoolVal`/`useTemplateIntVal`/`useTemplateFloatVal`/`useTemplate()`/`useMedia()`/`useConfig()`), called inside the function component that uses the value — never call `@dsplay/template-utils`'s vanilla `tval`/`tbval`/`tival`/`tfval`/`config`/`media`/`template` directly, and never read them at module scope as a one-time constant. `@dsplay/template-utils` should not appear as a direct dependency in this template's `package.json` (it's still pulled in transitively via `@dsplay/react-template-utils`).
- This template used to read variables directly from `@dsplay/template-utils`'s vanilla exports at **module scope** (in `contexts/styles-context/index.jsx` and `components/container/index.jsx`) — migrated to hooks. `contexts/styles-context/index.jsx` now exports a `useStyles()` hook (called from `Container`, whose result is passed into `StylesContext.Provider`) instead of a module-level `styles` constant. `utils/utils.js`'s pure pagination functions (`createPages`, `parseFeaturedImage`, `getCategoryUsageCount`) can't call hooks themselves (they're plain functions, not components) — `debug` and the raw `template` object are now passed in as parameters (via `createPages`'s `options` argument) from `Container`, which reads them with `useTemplateBoolVal('debug')`/`useTemplate()`. `utils.js`'s module-level `log()` became a `createLog(debug)` factory for the same reason — `createPages` builds its own `log` closure from the `debug` param at the top of the function instead of reading a module-level constant.
- `logo` (`menu-board/index.jsx`), `currencySymbol`/`currencyMaxCols` (`item/index.jsx`), and `image1`..`image15` (dynamically, as `template['image' + n]`, from `utils/utils.js`'s `parseFeaturedImage`) are all read via direct property access on the object returned by `useTemplate()`, rather than `useTemplateVal()` — `@dsplay/template-manifest`'s static scanner only recognizes `tval`/`useTemplateVal`-style calls, so none of these show up in the generated manifest. They're documented manually in the README's variable table instead.
- `debug` (`useTemplateBoolVal('debug')`, read in `Container`) gates all `console.log` diagnostic output in `utils/utils.js` — it's an internal debug switch, not currently registered as a CMS Template Var (intentionally; not meant for end users).
- `media.result.data.categories` is the actual menu content (see `public/dsplay-data.js` for the expected shape: each category has `cod`/`title`/`priceTitles`/`items`, each item has `num`/`title`/`description`/`price1`.. Special `num` values `/cb` (column break), `/pb` (page break), `/n` (blank line), `/fi(n[,size])` (featured image), `/li(n[,size])` (layout image, undecorated) drive layout — see `utils/utils.js`'s `createPages`.

### Fixed: `dsplay-data.js` was ~1000 lines of dead code, with the live example's images broken

Before this fix, `dsplay_media` was declared with a full ~940-line "Petiscos/Crepes/Frutos do Mar/..." menu as its `result`, which was then **immediately overwritten** two lines later by a separate `dsplay_media.result = {...}` assignment (a completely different "Esfihas/Salgados/..." menu) — the entire first menu was unreachable dead code. That reassignment was followed by three more large commented-out `dsplay_media.result = {...}` blocks (alternate example restaurants: delicatessen-são-josé, mr burguer, bouca louca). `dsplay_template` had the same pattern: a chain of commented-out per-restaurant blocks (delicatessen-são-josé, fiorentina, boca louka, a praça, mr-burguer), with only the last one ("casa da esfiha") actually live. Collapsed all of this down to the single live `dsplay_media`/`dsplay_template` declaration (~1053 lines → ~38).

The live "casa da esfiha" block's `logo`/`backgroundImage`/`image1`..`image9` all pointed at `../test-assets/casa-esfiha/...` — broken in the DSPLAY CMS preview for the same reason documented in `template-boilerplate-react`'s AGENTS.md (that folder is excluded from the production build). Replaced with a `ui-avatars.com` placeholder logo and real Wikimedia Commons food photos (esfihas, pizza, juice, banana split, a sweet-pastry substitute, picanha, salmon, wine, and a pitcher substitute for the juice jug — no exact "esfiha doce"/juice-pitcher photos were found on Commons). `backgroundOpacity: .0000001` is not a bug and wasn't touched — it controls a dominant-color-extracted overlay *tint* (`contexts/styles-context/index.jsx`), not the background image's own opacity, so a near-zero value means "show the photo at full clarity, no tint," which is exactly what renders.

`public/test-assets/` itself still has every image file for the now-deleted dead restaurant blocks (`delicatessen-sao-jose/`, `fiorentina-*`, `boca-*`, `a-praca/`, `mr-burguer/`) plus the `casa-esfiha/` originals now replaced above — all fully orphaned, not touched here pending a decision on `casa-esfiha/Recibo_1848_junho_2020.PDF` (an unrelated, seemingly real receipt PDF sitting in that folder, never referenced by any code, first committed in `974d050`).

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

### Known pending bump: ESLint 9 -> 10

`eslint`/`@eslint/js` are pinned to `^9.39.5` (latest is `10.x`). Bumping them currently fails on peer dependency conflicts: `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, and `eslint-plugin-react` haven't declared ESLint 10 support yet as of 2026-08-12 — they're still the actively-maintained canonical packages, not abandoned or superseded, just lagging behind the major. `eslint-plugin-react-hooks` already supports it. `eslint-plugin-unicorn` is pinned to `65.0.1` for the same reason (`66.0.0+` requires ESLint `>=10.4`). Don't force this with `--legacy-peer-deps` — re-check peer ranges periodically and bump all of them together once the laggards catch up.

## Commit messages

Every commit title must start with an emoji, followed by a short, imperative summary — e.g. `⬆️ upgrading deps`.

- The human maintainer uses [gitmoji-cli](https://github.com/carloscuesta/gitmoji-cli) for manual commits, so gitmoji conventions (`✨` feature, `🐛` fix, `⬆️` upgrade deps, `♻️` refactor, `🔥` remove code, `📝` docs) are a good default.
- Agents are not required to stick to the official gitmoji list — pick whichever emoji best represents the actual change in that commit, as long as it's placed at the start of the title.
