# WhereMike

A location-sharing app for someone who is not, in fact, anywhere near where it
says. Open it and you will find Michael in Lisbon. Tomorrow he is in Osaka.
The day after that, Cartagena. He moves around town during the day, stops for
lunch, and is back at the hotel by evening — and none of it ever happened.

It is a joke gift, built to look like a real product rather than a prank.

> **Everything in this app is fictional.** It does not read anyone's location,
> it has no access to any device, and the marker is not a person. The words
> "Now" and "Live" in the interface are simulation terminology, borrowed from
> the genre it is impersonating. Please do not use it to convince anyone of
> anything that matters.

---

## What it does

- Picks one of **1,319 real destinations** in **179 countries** for each
  calendar date, deterministically.
- Simulates a believable day of movement around that city — a morning start,
  several stops, real dwell time, a walk or a drive home.
- Renders it as a full-screen map with a marker and a status card, designed
  mobile-first for iPhone Safari.
- Costs **nothing per month** to run, and needs no server, database or cron.

---

## Architecture

```
Browser
  └── static files on a CDN
        ├── index.html
        ├── the app bundle
        └── the destination table (38 KB gzipped)

  ...and that is the entire system.
```

There is no backend because there is nothing for a backend to do. The two
things you would normally need a server for — *deciding today's city* and
*moving the marker around* — are both pure functions of the current time.

### Why no backend is needed

A conventional version of this would have a cron job that picks a city at
midnight and writes it to a database, plus an API the app polls. That is a
server, a database and a scheduler to pay for and keep alive.

Instead, the city is **derived** from the date:

```
destination = f(calendar date, SECRET_SEED)
```

Every browser computes the same answer independently, because `f` is
deterministic and both inputs are already known to the browser. When the date
rolls over, `f` returns something different. Nothing had to change on a server,
because nothing is stored on a server.

The same trick handles movement: the day's route is `g(date, city, seed, mode)`,
and the position right now is `h(route, time of day)`. Two people watching at
the same second see the same dot in the same place.

---

## How the deterministic daily location works

### The seeded generator

`src/lib/seededRandom.ts` implements xmur3 (string → 32-bit seed) feeding
mulberry32. `Math.random()` is never used for anything that has to match
between viewers — it would give every visitor a different city.

### The draw

Naively you would hash the date and index into the list. That gives you Lyon
on Tuesday and Nice on Wednesday, and Paris again a fortnight later.

Instead the itinerary is a **permutation**. Time is cut into epochs of exactly
one-destination-each, and within an epoch the whole dataset is shuffled with a
seeded generator. Every city is visited once before any city is visited twice —
about **3 years and 7 months** before the first repeat. "Never the same city
two days running" is therefore structural rather than a rule that has to be
enforced.

A repair pass then walks the shuffled order and pushes entries back when they
would break one of the spacing rules in `src/config.ts`:

| Rule | Default |
| --- | --- |
| `NO_REPEAT_COUNTRY_DAYS` | no country reused within 6 days |
| `NO_REPEAT_CONTINENT_DAYS` | no continent on consecutive days |
| `MIN_HOP_DISTANCE_KM` | consecutive cities at least 400 km apart |

The minimum hop matters more than it sounds: without it you get "Nice →
Cannes", which reads as a bug rather than a joke.

### Which midnight?

`DAY_BOUNDARY` in `src/config.ts` is `'local'`, so the city changes at *your*
midnight. Set it to `'utc'` if you would rather every viewer on earth flip at
the same instant.

---

## How movement simulation works

The marker does not sit still all day, and it does not wander aimlessly either.

`src/lib/movementEngine.ts` builds one plan per `(date, city, seed, mode)` in
two passes:

1. **Pick the stops and cost the travel.** Five to twelve points around the
   city, and how long it takes to get between them at a plausible pace.
2. **Share out what is left.** The remaining minutes are distributed across the
   stops, keeping the random unevenness but scaling it so the stops actually
   fill the day.

Doing it in that order matters. Laying a day out greedily from the front leaves
the journey home with whatever minutes happen to remain, which is how you end
up with someone apparently walking across town at 55 km/h.

Between waypoints, positions are interpolated with smoothstep easing, so
departures and arrivals ease rather than snap. While stationary the marker gets
a few metres of slow drift from two out-of-phase sine terms — enough that it
looks alive, not so much that it looks like a GPS fault.

### Movement modes

| Mode | Character |
| --- | --- |
| `stationary` | Barely leaves the neighbourhood. 1–3 short trips, long stops. |
| `walking` | Everything on foot, 4.6 km/h, nothing far away. |
| `tourist` *(default)* | 4–8 stops, walks the short legs and takes transport for the long ones, with genuinely long lunches. The most natural-looking mix. |
| `driving` | 5–9 stops, wider range, shorter stops. |

### Land safety — the part that took the most work

The marker must never turn up in the sea. Doing that properly usually means a
paid geocoding API, which would break the zero-cost requirement, so the
safety is **precomputed into the dataset instead**.

At data-build time, every destination is tested against Natural Earth 10m land
and lake polygons. The compass around each city is divided into 16 sectors, and
a sector is accepted only if three sample points along it — near, middle and
rim — are all dry land. The result is a 16-bit mask stored on each row:

```
za-cape-town | ... | 8 | major-city | 2040
                                      ^^^^ only the inland sectors are set;
                                           the Atlantic ones are not
```

At runtime the engine confines a whole day to the **longest contiguous run** of
set sectors, and every straight leg between two stops is sampled along its
length and rejected if any part of it leaves that run. That last check is not
redundant: a land run wider than 180° is not convex, so in Melbourne a leg
between two perfectly valid stops can cut straight across Port Phillip Bay.

The roaming radius itself is shrunk at build time until enough of the compass
is dry, which is why Cape Town gets 8 km and a coral atoll gets 1.4 km. Four
places (Gibraltar's centroid, two atolls, one island town) could not be made
safe at any radius and were dropped.

This is verified rather than asserted. `src/lib/exhaustive.test.ts` samples
**every destination × every mode × four dates × every three minutes** — about
10.1 million positions — and checks each one is inside both the radius and a
verified-land sector.

---

## The destination dataset

`src/data/destinations.generated.ts` — 1,319 rows, 179 countries, 38 KB
gzipped.

It is a pipe-delimited string rather than an array of objects, because 1,300
repeated copies of `"latitude":` cost several times more over the wire than the
numbers do, and one-line-per-place is far easier to hand-edit.

```
id|city|region|country|countryCode|continent|lat|lng|timezone|radiusKm|category|landSectors
```

Geographic spread:

| Continent | Count | Share |
| --- | ---: | ---: |
| Asia | 389 | 29.5% |
| Europe | 367 | 27.8% |
| Africa | 219 | 16.6% |
| North America | 191 | 14.5% |
| South America | 108 | 8.2% |
| Oceania | 45 | 3.4% |

No country exceeds 5.3% of the list — the United States is capped at 70 cities,
which is the whole point of the per-country quotas in `scripts/curation.mjs`.

Categories: `major-city`, `capital`, `beach`, `small-city`, `historic`,
`island`, `tropical`, `mountain`, `nightlife`, `vacation`.

### An editorial note

`EXCLUDED_COUNTRIES` in `scripts/curation.mjs` leaves out a handful of
countries in active conflict. This is a judgement call, not a technical one: a
light-hearted "guess where Michael is today" lands badly when the answer is a
war zone. Delete any line to put that country back in play.

---

## Running it

```bash
npm install
npm run dev
```

Then open the printed URL. The control panel is at `/control`.

```bash
npm test          # the test suite
npm run typecheck # TypeScript, no emit
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

Rebuilding the destination dataset is a separate, rarely-needed step. It
downloads ~15 MB of Natural Earth polygons on first run and caches them in
`scripts/.cache/` (gitignored):

```bash
npm run data:build
```

---

## Deploying

The site is static, so any static host works. This repo deploys to **GitHub
Pages** from a `gh-pages` branch:

```bash
npm run deploy
```

That builds with the right base path and force-pushes `dist/` to `gh-pages`. It
needs nothing beyond a normal `git push` — no CI configuration and no extra
token scopes.

If you would rather deploy on every push, `docs/github-actions-pages.yml` is a
ready-made workflow. Move it to `.github/workflows/` and switch Pages to
"GitHub Actions". Note that pushing a file under `.github/workflows/` requires
a token with the `workflow` scope, which is exactly why `npm run deploy`
exists.

**Cloudflare Pages** works equally well if you prefer it: connect the repo,
set the build command to `npm run build` and the output directory to `dist`.
Leave `VITE_BASE` unset — a Pages site is served from the domain root, so the
default relative base is correct.

### Monthly cost

**$0.** Static hosting is free on GitHub Pages and Cloudflare Pages alike. Map
tiles come from [OpenFreeMap](https://openfreemap.org), which serves the whole
OpenStreetMap planet with no API key, no account and no billing relationship.
There is no database, no scheduled job, no serverless function and no paid API
anywhere in the stack.

---

## Making it yours

### Change the name

`src/config.ts`:

```ts
export const APP_NAME = 'WhereMike'   // browser tab, about sheet
export const DISPLAY_NAME = 'Michael' // the name on the status card
```

`APP_NAME` is a placeholder — the project name is meant to be easy to replace.
Also update `<title>` in `index.html`, and the repository name if you care.

### Change the profile photo

Drop a square image into `public/` and point at it:

```ts
export const PROFILE_IMAGE_FILE = 'me.jpg'
```

That is the only change needed — the URL is resolved against the deployment's
base path automatically, and the marker crops it to a circle.

### Change SECRET_SEED

```ts
export const SECRET_SEED = 'wheremike-v1-8f3a92'
```

Change this string and **every date resolves to a completely different city**,
past and future. Any string works. It is "secret" only in the sense that a
visitor is unlikely to bother digging it out of the bundle — the app is
entirely client-side, so it is not a cryptographic secret and should not be
reused as one.

### Change how often the destination changes

```ts
export const DAYS_PER_DESTINATION = 1   // 2 = every other day, 7 = weekly
```

### Add or remove destinations

Two options.

**By hand**, for one-offs — append a line to `DESTINATION_TABLE` in
`src/data/destinations.generated.ts`:

```
fr-annecy|Annecy|Haute-Savoie|France|FR|EU|45.8992|6.1294|Europe/Paris|3.5|mountain|65535
```

`landSectors` is a 16-bit mask where bit *N* covers the compass sector starting
at *N* × 22.5°. `65535` means "land in every direction", which is right for an
inland city. For anywhere coastal, either pick a conservative radius and clear
the seaward bits, or regenerate properly.

**Properly**, by regenerating — edit `scripts/curation.mjs` (quotas,
`MUST_INCLUDE`, exclusions, categories) and run `npm run data:build`. The land
mask, roaming radius and category are all computed for you.

---

## Control mode

Open `/control` — or `#/control` on any host without URL rewriting. It is not
linked from the viewer, and there is nothing to log into, because there is
nothing to protect: every override lives in **this browser's localStorage** and
is invisible to everyone else.

It lets you:

- see yesterday's, today's and tomorrow's destination side by side
- jump to any date and preview the next two weeks of itinerary
- try a different seed and see how much the sequence changes
- switch movement mode and scrub the time of day
- inspect the day's movement plan as a 24-hour timeline
- force a specific city out of all 1,319
- reroll the movement plan, or scale the roaming radius
- turn on accelerated-day testing
- toggle the debug overlay and override the display name
- copy a shareable debug link
- **reset every local override**

### Accelerated testing

Waiting 24 hours to check that the city changes is not a testing strategy. The
control panel can compress a simulated day into 1, 2 or 5 real minutes: the
date advances at that rate and the time of day cycles within it, so you can
watch several days of destinations and a full day of movement go by in a
couple of minutes.

It is strictly a local override. Production behaviour always uses real calendar
days — there is no build flag and no server setting that could accidentally
ship it.

### URL parameters

Handy for debugging without touching localStorage. These apply for one page
load and are never persisted.

| Parameter | Effect |
| --- | --- |
| `?date=2026-09-18` | force a calendar date |
| `?city=fr-paris` | force a destination by id |
| `?seed=anything` | preview a different seed |
| `?mode=walking` | `stationary` \| `walking` \| `tourist` \| `driving` |
| `?time=14:30` | pin the destination's local time of day |
| `?speed=60` | accelerate: 60× means a day every 24 minutes |
| `?radius=1.5` | scale the roaming radius |
| `?debug=1` | show the debug overlay |
| `?name=Sam` | override the display name |

### Resetting local overrides

Press **Reset all local overrides** in the control panel. Failing that, clear
the `wheremike.overrides.v1` key from localStorage, or the site's storage
entirely. Overrides never leave the browser that set them.

---

## Project layout

```
scripts/
  build-destinations.mjs   dataset generator (dev only)
  curation.mjs             editorial inputs: quotas, must-haves, exclusions
  geo-mask.mjs             Natural Earth point-in-polygon land oracle
  deploy.mjs               publishes dist/ to gh-pages
src/
  components/              viewer UI and the control panel's parts
  data/                    the destination table and its typed parser
  hooks/                   useViewerState, useOverrides
  lib/                     the engine, and its tests
    seededRandom.ts        deterministic PRNG
    dailyDestination.ts    the daily draw
    movementEngine.ts      route planning and interpolation
    geoUtils.ts            spherical geometry and the land-sector logic
    timeUtils.ts           calendars, zones and clocks
    simulation.ts          ties it together into one ViewerState
    overrides.ts           localStorage + URL parameter layer
    mapStyle.ts            tile provider (swap here)
    router.ts              two routes, hand-rolled
  routes/                  Viewer and Control
  types/                   shared domain types
  config.ts                everything you are likely to want to change
```

---

## Licence and attribution

Map tiles from [OpenFreeMap](https://openfreemap.org). Map data
© [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
Destination coordinates derive from
[city-timezones](https://github.com/kevinroberts/city-timezones); coastline
and lake geometry from [Natural Earth](https://www.naturalearthdata.com/)
(public domain).

This project is not affiliated with, endorsed by, or connected to Apple Inc.
or any other location-sharing service. It borrows the *genre* — a map, a
marker, a card at the bottom — the way any mapping app does, and nothing else.
