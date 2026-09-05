# Product

<!-- uizze:product-schema 1 -->

## Platform

web

## Users

Khaled Waleed's personal site. Visitors, in no fixed order of importance: hiring managers and peers evaluating him (/story carries the CV verbatim), readers of the essays and fiction (/writing, RSS), people resolving his name from search (several spelling variants, plus a same-name rival domain), friends, and Khaled himself, who treats the site as a made thing and its living logs as the canonical record of his taste.

## Product Purpose

One address that is identity, portfolio, writing desk, and taste catalogue at once. When priorities conflict there is no standing winner: personal-artifact concerns and professional-front concerns are judged per case (his ruling, 2026-08-23). All four success signals count: owning the name SERP, inbound senior-role and contract opportunities via /contact, the writing being read, and the artifact justifying itself.

## Positioning

A personal museum instead of a developer portfolio: every page is a room hung with one public-domain painting, and the craft of the site itself is the proof of the "Design Engineer" claim. The design performs the museum; the copy never does (register law: plain by default, museum vocabulary banned from interface copy, about five crafted lines budgeted site-wide).

## Operating Context

- SvelteKit 5 + Tailwind 4 + mdsvex, prerendered, deployed on Cloudflare Pages; push to main is a deploy.
- The films and music logs read from a self-hosted PocketBase; posters are served from its file fields.
- Facts about Khaled sync FROM a private canon file (khaled.md) outside this repo and are never invented on-site first; /story mirrors the CV word for word.

## Capabilities and Constraints

- Living logs: /films (every film scored), /music (live Spotify), /likes; closed rooms 301 or 302 through the hooks redirect map, never a _redirects file; /storeroom keeps retired canvases.
- Painting and logo assets are immutable-cached for a year: a re-hang requires a new content-derived filename, never a byte-swap in place.
- Western digits only. Zero em dashes anywhere. Authored text in English.
- The /writing/r piece is his, verbatim; never trimmed or edited.

## Brand Commitments

- Name: Khaled Waleed; brand title "Design Engineer"; the bio line and every personal fact come from the private canon file.
- The drawn "kw" script monogram is the mark; the favicon is the k alone, deliberately.
- Voice: plain register, direct, shorter than default; the anti-slop writing rules are site law.
- A quiet dedication threads the site: "for r." closing the footer colophon, one bare "R" after the last /likes section, "R." in humans.txt. Initial-only is a hard ceiling; the name never enters this public repo or its history.
- Sound: glass-tap ticks and one Chopin nocturne, site-wide, armed only on real gestures.
- "Crafted by Vitex" credit in the footer: his studio.

## Evidence on Hand

- Real essays and one fiction piece in src/posts/*.svx.
- Real logs: 225 films with posters on PocketBase, live Spotify listening, the /likes catalogue.
- The CV PDF at static/Khaled-Waleed-Resume.pdf, synced from the private canon.
- Public-domain paintings with real museum attributions on every room.
- No testimonials, no metrics, no client logos on the site; do not fabricate any.

## Product Principles

1. The craft is the claim: the site itself must be the best evidence that he is a design engineer.
2. No standing priority between artifact and career; judge conflicts per case, and ask when the call is genuinely his.
3. Facts flow one way, from the private canon to the site; nothing personal is invented here first.
4. Quiet things stay quiet: dedications, easter eggs, and the storeroom are load-bearing and never explained in copy.
5. Content is alive: the logs and writing keep moving, so presentation must serve pieces that do not exist yet.

## Accessibility & Inclusion

No formal standard adopted. Standing commitments already in the code: reduced-motion visitors lose choreography but are never hidden from content, no-JS visitors get the full page, print renders pages as catalogue leaves, focus-visible is themed, and hash anchors keep working under the route-scroll regime.
