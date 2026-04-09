# Mileage Calculator — CLAUDE.md

## Project Overview

A **Progressive Web App (PWA)** that lets users pick two locations on an interactive map, calculates the driving distance in miles, and estimates the trip fuel cost using the current average unleaded gas price in Michigan.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19+ (with hooks) |
| Build Tool | Vite 6+ |
| Styling | Tailwind CSS v4 |
| PWA | `vite-plugin-pwa` (Workbox) |
| Mapping | Leaflet + React-Leaflet |
| Geocoding / Routing | OpenRouteService API (free tier) or OSRM |
| Gas Price Data | GasBuddy scrape or EIA API (US Energy Information Administration) |
| State Management | React Context + `useReducer` (no external store needed) |

---

## Project Structure

```
mileage-calculator/
├── public/
│   ├── icons/                  # PWA icons (192x192, 512x512)
│   └── manifest.json           # Web App Manifest
├── src/
│   ├── components/
│   │   ├── Map/
│   │   │   ├── MapView.jsx         # Leaflet map container
│   │   │   ├── LocationMarker.jsx  # Draggable pin component
│   │   │   └── RoutePolyline.jsx   # Drawn route on map
│   │   ├── LocationInput/
│   │   │   ├── LocationSearch.jsx  # Address autocomplete input
│   │   │   └── CoordinateDisplay.jsx
│   │   ├── TripSummary/
│   │   │   ├── TripCard.jsx        # Distance + cost summary card
│   │   │   ├── GasPriceDisplay.jsx # Current MI gas price badge
│   │   │   └── MPGInput.jsx        # User-configurable MPG field
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── Spinner.jsx
│   ├── hooks/
│   │   ├── useRouting.js       # Fetch distance from routing API
│   │   ├── useGasPrice.js      # Fetch Michigan avg gas price
│   │   └── useGeolocation.js   # Browser geolocation for "use my location"
│   ├── context/
│   │   └── TripContext.jsx     # Global trip state (locations, distance, cost)
│   ├── services/
│   │   ├── routing.js          # Routing API abstraction
│   │   └── gasPrice.js         # EIA / GasBuddy API abstraction
│   ├── utils/
│   │   ├── formatters.js       # Distance, currency, number formatters
│   │   └── geo.js              # Haversine fallback, coord helpers
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css               # Tailwind directives
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## Core Features

### 1. Map Interface
- Interactive Leaflet map centered on Michigan by default
- Two draggable markers: **Origin** (green) and **Destination** (red)
- Route polyline drawn between the two points after calculation
- "Use my location" button to snap Origin to user's GPS position

### 2. Location Search
- Address autocomplete for both origin and destination fields
- Clicking on the map also sets a marker (alternates Origin → Destination)
- Markers can be dragged to fine-tune position; distance recalculates on drop

### 3. Distance Calculation
- Primary: Driving distance via **OpenRouteService Directions API** (returns road miles)
- Fallback: Straight-line Haversine distance with a disclaimer
- Display both miles and kilometers

### 4. Gas Price Integration
- Fetch the **current Michigan average unleaded (regular) gas price** from the EIA API:
  ```
  https://api.eia.gov/v2/petroleum/pri/gnd/data/
    ?api_key=YOUR_KEY&frequency=weekly&data[]=value
    &facets[series][]=EMM_EPMRU_PTE_SMI_DPG   ← Michigan regular unleaded
  ```
- Cache the result in `localStorage` with a 24-hour TTL to avoid hammering the API
- Show the price source and "as of [date]" label in the UI

### 5. Fuel Cost Calculation
```
Cost = (Distance ÷ MPG) × Gas Price Per Gallon
```
- MPG defaults to **28** (US average for passenger cars)
- User can override MPG via an inline input field
- Show one-way and round-trip costs side by side

### 6. PWA Requirements
- `manifest.json` with `name`, `short_name`, `icons`, `display: standalone`, `theme_color`
- Service worker via `vite-plugin-pwa` with **network-first** strategy for API calls and **cache-first** for static assets
- Offline fallback page when no network and no cached route data

---

## Environment Variables

Store in `.env.local` (never commit):

```
VITE_ORS_API_KEY=          # OpenRouteService API key
VITE_EIA_API_KEY=          # EIA API key (free, register at eia.gov)
```

Access in code via `import.meta.env.VITE_ORS_API_KEY`.

---

## Key Implementation Notes

### Routing API Call Pattern
```js
// src/services/routing.js
export async function getDrivingDistance(origin, destination) {
  const url = `https://api.openrouteservice.org/v2/directions/driving-car`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': import.meta.env.VITE_ORS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    }),
  });
  const data = await res.json();
  const meters = data.routes[0].summary.distance;
  return meters * 0.000621371; // convert to miles
}
```

### Gas Price Cache Pattern
```js
// src/hooks/useGasPrice.js
const CACHE_KEY = 'mi_gas_price';
const TTL_MS = 24 * 60 * 60 * 1000;

export function useGasPrice() {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.timestamp < TTL_MS) {
      setPrice(cached.value);
      return;
    }
    fetchMichiganGasPrice().then(value => {
      setPrice(value);
      localStorage.setItem(CACHE_KEY, JSON.stringify({ value, timestamp: Date.now() }));
    });
  }, []);

  return price;
}
```

### Tailwind Setup
Use the `@import "tailwindcss"` directive in `index.css` (Tailwind v4 approach — no `@tailwind` directives needed). Extend the theme in `tailwind.config.js` for brand colors if desired.

---

## Styling Conventions

- Use Tailwind utility classes directly on JSX elements — no separate CSS files
- Prefer `flex` and `grid` for layouts
- Mobile-first breakpoints: base → `sm:` → `md:` → `lg:`
- Map container must be explicitly sized: `h-[60vh] w-full` or similar — Leaflet requires a non-zero height
- Use `dark:` variants for a dark mode toggle (store preference in `localStorage`)

---

## Vite Config Essentials

```js
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Mileage Calculator',
        short_name: 'MileCalc',
        theme_color: '#1d4ed8',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.openrouteservice\.org/,
            handler: 'NetworkFirst',
          },
          {
            urlPattern: /^https:\/\/api\.eia\.gov/,
            handler: 'NetworkFirst',
          },
        ],
      },
    }),
  ],
});
```

---

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build
npm run preview      # Preview production build locally
```

---

## Accessibility & UX Requirements

- All interactive elements must have visible focus rings (Tailwind `focus-visible:ring-2`)
- Map markers must have `aria-label` attributes ("Origin location", "Destination location")
- Loading states shown with a `Spinner` component during API fetches
- Error states displayed inline (failed routing, failed gas price fetch) with retry buttons
- Input fields labeled with `<label>` elements (not just placeholder text)

---

## Out of Scope (v1)

- Multi-stop/waypoint routing
- Traffic-aware ETAs
- Fuel station finder
- Trip history / saved routes
- Non-Michigan gas prices (hardcoded to Michigan EIA series)
