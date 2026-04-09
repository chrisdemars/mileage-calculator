import { useState, useEffect } from 'react';
import { TripProvider, useTrip } from './context/TripContext.jsx';
import { MapView } from './components/Map/MapView.jsx';
import { LocationSearch } from './components/LocationInput/LocationSearch.jsx';
import { CoordinateDisplay } from './components/LocationInput/CoordinateDisplay.jsx';
import { TripCard } from './components/TripSummary/TripCard.jsx';
import { Button } from './components/ui/Button.jsx';
import { useRouting } from './hooks/useRouting.js';
import { useGeolocation } from './hooks/useGeolocation.js';

function AppContent() {
  const { state, dispatch } = useTrip();
  const { result } = useRouting(state.origin, state.destination);
  const { getCurrentPosition, loading: geoLoading, error: geoError } = useGeolocation();
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleUseMyLocation = async () => {
    try {
      const coords = await getCurrentPosition();
      dispatch({ type: 'SET_ORIGIN', payload: coords });
    } catch {
      // error shown via geoError
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label="car">🚗</span>
          <h1 className="text-lg font-bold text-blue-700 dark:text-blue-400">MileCalc</h1>
          <span className="hidden sm:inline text-sm text-gray-500 dark:text-gray-400">Michigan Mileage Calculator</span>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle dark mode"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-4 space-y-4">
        {/* Location inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <LocationSearch
              id="origin-search"
              label="Origin"
              placeholder="Search origin address…"
              onSelect={(r) => dispatch({ type: 'SET_ORIGIN', payload: { lat: r.lat, lng: r.lng } })}
            />
            <CoordinateDisplay coords={state.origin} label="Origin" />
            <div className="mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={handleUseMyLocation}
                disabled={geoLoading}
                aria-label="Use my current location as origin"
              >
                {geoLoading ? 'Locating…' : '📍 Use my location'}
              </Button>
              {geoError && (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{geoError}</p>
              )}
            </div>
          </div>

          <div>
            <LocationSearch
              id="destination-search"
              label="Destination"
              placeholder="Search destination address…"
              onSelect={(r) => dispatch({ type: 'SET_DESTINATION', payload: { lat: r.lat, lng: r.lng } })}
            />
            <CoordinateDisplay coords={state.destination} label="Destination" />
          </div>
        </div>

        {/* Click hint */}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tip: click the map to place markers — first click sets{' '}
          <span className="text-green-600 dark:text-green-400 font-medium">origin</span>,
          second sets{' '}
          <span className="text-red-600 dark:text-red-400 font-medium">destination</span>.
          Drag markers to adjust.
        </p>

        {/* Map */}
        <MapView routeGeometry={result?.geometry} />

        {/* Trip Summary */}
        <TripCard />

        {/* Clear button */}
        {(state.origin || state.destination) && (
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => dispatch({ type: 'CLEAR' })}>
              Clear route
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <TripProvider>
      <AppContent />
    </TripProvider>
  );
}
