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
    app/                        <-- top-level component, imports bootstrap + menu.css
    container/                  <-- reads media/template vars, builds pages, rotates through them
    menu-board/                 <-- lays out one page's up-to-3 columns + the brand/ad box
    column/                     <-- renders one column's items (category/spacer/pricesHead/featuredImage/item)
    item/, section-title/, prices-head/, featured-image/, spacer/  <-- individual row/widget types
build.sh                    <-- zips the Vite build output into template.zip
```

## File and folder naming

- **kebab-case everywhere** in `src/` (and anywhere else in this repo we author ourselves) — folders, JS/JSX files, Sass files, test files. Doesn't apply to files whose name is a fixed convention from tooling (`package.json`, `vite.config.js`, etc.) or to vendored/third-party assets we don't control the naming of (`src/assets/styles/bootstrap/`, `src/assets/fonts/`).
- **Every component gets its own folder with an `index.jsx`.** For a simple component, `index.jsx` *is* the component.
- **Always import a component by its folder, never by reaching into `index`** — `import Column from '../column'`, never `.../column/index`.
- Non-component modules (context, hooks, utils) live outside `components/` in their own top-level folder, following the same folder+`index.jsx` convention only when they export a component (e.g. `contexts/styles-context/index.jsx` provides `StylesContext` and exports its `styles` object) — plain `.js` files elsewhere don't need it.
- Enforced automatically by ESLint's `unicorn/filename-case` rule for the naming half of this; the folder+`index.jsx`+import-by-folder structure is not machine-checked, just convention.

## Package identity

`package.json`'s `"name"` must identify this template, not the boilerplate it was cloned from — see `template-boilerplate-react`'s AGENTS.md for the full convention. This template's is `dsplay-template-menuboard`.

## README structure

Every DSPLAY template's `README.md` follows the same skeleton (see `template-boilerplate-react`'s AGENTS.md for the full reference copy).

## Pre-hooks architecture

This template predates `@dsplay/react-template-utils`'s hooks (`useTemplateVal` etc.) — it reads variables directly from `@dsplay/template-utils`'s exported `tval`/`tbval`/`tival`/`tfval` functions and `template`/`media`/`config` objects, mostly at **module scope** (in `contexts/styles-context/index.jsx` and `components/container/index.jsx`), not inside component bodies. This is deliberate, matching the precedent set in `template-horizontal-info-bar`/`template-instagram-basic`/`template-twitter-basic` — don't rewrite this into hooks-based reads; it would be a behavior-neutral refactor with real regression risk for no benefit, since none of these values ever change after the initial `dsplay-data.js`/`DSPLAY.getData()` load.

- `logo` (`menu-board/index.jsx`), `currencySymbol`/`currencyMaxCols` (`item/index.jsx`), and `image1`..`image15` (dynamically, as `template['image' + n]`, from `utils/utils.js`'s `parseFeaturedImage`) are all read via direct `template.<key>` property access rather than `tval()` — `@dsplay/template-manifest`'s static scanner only recognizes `tval`/`tbval`/`tival`/`tfval` calls, so none of these show up in the generated manifest. They're documented manually in the README's variable table instead.
- `debug` (`tbval('debug')`) gates all `console.log` diagnostic output in `utils/utils.js` — it's an internal debug switch, not currently registered as a CMS Template Var (intentionally; not meant for end users).

## Runtime model

- `public/dsplay-data.js` defines `dsplay_config`/`dsplay_media`/`dsplay_template` mock globals used only in **development**. `build.sh` blanks its content in the production build — the DSPLAY Android app injects the real `window.DSPLAY.getData()` before any script runs.
- `media.result.data.categories` is the actual menu content (see `public/dsplay-data.js` for the expected shape: each category has `cod`/`title`/`priceTitles`/`items`, each item has `num`/`title`/`description`/`price1`.. Special `num` values `/cb` (column break), `/pb` (page break), `/n` (blank line), `/fi(n[,size])` (featured image), `/li(n[,size])` (layout image, undecorated) drive layout — see `utils/utils.js`'s `createPages`.

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
