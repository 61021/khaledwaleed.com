# khaledwaleed.com

The personal website of **Khaled Waleed** — a senior software engineer in Baghdad, Iraq. A quiet, atmospheric site built with SvelteKit and Go-flavoured sensibilities, where every page is its own dimly-lit room hung with a public-domain Northern Romantic painting.

🔗 **Live:** [khaledwaleed.com](https://khaledwaleed.com)

<p>
  <img alt="SvelteKit" src="https://img.shields.io/badge/SvelteKit-2-FF3E00?logo=svelte&logoColor=white">
  <img alt="Svelte 5" src="https://img.shields.io/badge/Svelte-5%20(runes)-FF3E00?logo=svelte&logoColor=white">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-38BDF8?logo=tailwindcss&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white">
  <img alt="Bun" src="https://img.shields.io/badge/Bun-1.3-000000?logo=bun&logoColor=white">
  <img alt="Cloudflare Pages" src="https://img.shields.io/badge/Cloudflare-Pages-F38020?logo=cloudflare&logoColor=white">
</p>

---

## The idea

It's a portfolio, a blog, and a small personal museum. Each route is a **room**, and each room is paired with a famous public-domain painting (Friedrich, Dahl, Rembrandt, Vermeer, Wright of Derby…) that sets its colour palette and mood. The result is a calm, reading-first site rather than a dashboard of widgets.

Almost everything is **prerendered to static HTML** at build time. The single exception is `/music`, which runs live on the edge to read recent listening data from Spotify.

## Tech stack

| Concern      | Choice                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------- |
| Framework    | [SvelteKit 2](https://svelte.dev/docs/kit) with Svelte 5 runes                                           |
| Styling      | [Tailwind CSS 4](https://tailwindcss.com) + `@tailwindcss/typography`                                    |
| Content      | [mdsvex](https://mdsvex.pngwn.io) (`.svx`) for writing                                                   |
| Language     | TypeScript                                                                                               |
| OG images    | [satori](https://github.com/vercel/satori) + resvg (generated at build)                                  |
| Fonts        | Self-hosted [Inter](https://rsms.me/inter/) + [Fraunces](https://fraunces.undercase.xyz/) via Fontsource |
| Runtime / PM | [Bun](https://bun.sh)                                                                                    |
| Hosting      | [Cloudflare Pages](https://pages.cloudflare.com) (`@sveltejs/adapter-cloudflare`)                        |

## Getting started

### Prerequisites

- [Bun](https://bun.sh) `1.3+`

### Install & run

```sh
bun install
bun run dev          # start the dev server
bun run dev -- --open  # …and open it in the browser
```

### Other scripts

```sh
bun run build    # production build (static + edge functions)
bun run preview  # preview the production build locally
bun run check    # type-check with svelte-check
bun run lint     # prettier --check + eslint
bun run format   # prettier --write
```

## Environment variables

Copy [`.env.example`](.env.example) to `.env` and fill in what you need. Everything works without them — the `/music` page and poster art simply fall back to empty/placeholder states.

| Variable                | Used for                                                              |
| ----------------------- | --------------------------------------------------------------------- |
| `TMDB_API_KEY`          | Film metadata & posters when adding titles (`scripts/build-films.ts`) |
| `SPOTIFY_CLIENT_ID`     | Live `/music` page — top tracks & artists                             |
| `SPOTIFY_CLIENT_SECRET` | Live `/music` page                                                    |
| `SPOTIFY_REFRESH_TOKEN` | Live `/music` page (obtain via `bun run scripts/spotify-auth.ts`)     |

In production the three `SPOTIFY_*` values are set as Cloudflare Pages environment variables.

## Project structure

```
src/
├─ app.css                # design tokens, per-room palettes, typography
├─ app.html               # document shell
├─ lib/
│  ├─ site.ts             # ← central config: bio, socials, paintings, room map
│  ├─ posts.ts            # typed index of writing posts
│  ├─ films.json          # ← your data: rating, watched, dates, public/private notes
│  ├─ films.ts            # auto-generated: films.json + TMDB metadata & poster paths
│  ├─ index.ts            # barrel exports
│  └─ components/         # Seo, JsonLd, Container, Button, CommandPalette, …
├─ posts/                 # writing, as .svx (mdsvex)
└─ routes/
   ├─ +layout.svelte      # shell: nav, footer, room/painting, command palette
   ├─ +page.svelte        # home
   ├─ about · now · likes · library · films · music · contact · writing
   ├─ og.png/             # generated Open Graph image
   └─ sitemap.xml · robots.txt · rss.xml
scripts/                  # data tooling (see below)
static/                   # paintings, logos, manifest, etc.
```

`src/lib/site.ts` is the heart of the site — bio, contact details, social links, and the painting-per-room map all live there. Edit values in one place rather than hunting through components.

## Pages

| Route      | What it is                                                        |
| ---------- | ----------------------------------------------------------------- |
| `/`        | Home / hero — the canonical profile page                          |
| `/about`   | Longer bio                                                        |
| `/now`     | A [now page](https://nownownow.com): current focus                |
| `/writing` | Essays (Markdown via mdsvex), with `/writing/[slug]`              |
| `/library` | Books                                                             |
| `/films`   | A ledger of ~220 rated films & shows, with hotlinked TMDB posters |
| `/music`   | **Live** top tracks & artists from Spotify (edge-rendered)        |
| `/likes`   | A grab-bag of recommendations                                     |
| `/contact` | Ways to get in touch                                              |

## Data & content tooling

The `scripts/` folder holds small Bun scripts for maintaining content:

| Script               | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `add-film.ts`        | Add/update a title's rating & watched count in `films.json`, then rebuild |
| `build-films.ts`     | Bake TMDB metadata + poster paths from `films.json` into `films.ts`       |
| `fetch-paintings.ts` | Download & convert room paintings to AVIF/WebP (via `sharp`)              |
| `spotify-auth.ts`    | One-time OAuth flow to mint a Spotify refresh token                       |

Run any of them with `bun run scripts/<name>.ts`.

- **Writing** — add a `.svx` file under `src/posts/` and register it in `src/lib/posts.ts`.
- **Films** — edit `src/lib/films.json` directly (it's the single source of truth), or use `add-film.ts`.
- **A new room** — add a painting to the `paintings` map in `site.ts`, map it in `roomForPath`, add a `[data-room]` palette in `app.css`, and drop the image in `static/paintings/`.

## Deployment

The site builds with `@sveltejs/adapter-cloudflare` and deploys to **Cloudflare Pages**. The static pages are served from the edge cache; `/music` runs as a Pages Function. The adapter's `routes.exclude` list in [`svelte.config.js`](svelte.config.js) keeps the generated `_routes.json` under Cloudflare's 100-rule limit by collapsing asset folders into wildcards.

## Credits

- **Paintings** are in the public domain; each is credited (artist, year, museum) in `src/lib/site.ts` and on the page footers.
- Film metadata & posters from [The Movie Database (TMDB)](https://www.themoviedb.org) — this product uses the TMDB API but is not endorsed or certified by TMDB.
- Listening data via [Spotify](https://spotify.com).

## License

The source is public so others can read, learn from, and borrow ideas. The **written content, design, and personal data are © Khaled Waleed** — please don't republish them wholesale or pass the site off as your own. Bundled paintings are public domain; third-party assets belong to their respective owners.
