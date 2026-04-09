import { useTrip } from '../../context/TripContext.jsx';
import { useRouting } from '../../hooks/useRouting.js';
import { useGasPrice } from '../../hooks/useGasPrice.js';
import { formatMiles, formatKm, formatCurrency } from '../../utils/formatters.js';
import { Card } from '../ui/Card.jsx';
import { Spinner } from '../ui/Spinner.jsx';
import { MPGInput } from './MPGInput.jsx';
import { GasPriceDisplay } from './GasPriceDisplay.jsx';

export function TripCard() {
  const { state } = useTrip();
  const { result, loading, error } = useRouting(state.origin, state.destination);
  const { price: gasPrice } = useGasPrice();

  const miles = result?.miles ?? null;
  const cost = miles != null && gasPrice != null
    ? (miles / state.mpg) * gasPrice
    : null;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">Trip Summary</h2>
        <GasPriceDisplay />
      </div>

      {!state.origin && !state.destination && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click the map or search for addresses to set your origin and destination.
        </p>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Spinner size="sm" /> Calculating route…
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">
          Routing error: {error}
        </p>
      )}

      {result?.isFallback && (
        <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-lg px-3 py-2">
          Showing straight-line distance (no ORS API key configured). Actual driving distance may differ.
        </p>
      )}

      {miles != null && !loading && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Distance</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMiles(miles)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatKm(miles)}</p>
          </div>
          <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Round trip</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{formatMiles(miles * 2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatKm(miles * 2)}</p>
          </div>
          {cost != null && (
            <>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400">One-way cost</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(cost)}</p>
              </div>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/30 p-3">
                <p className="text-xs text-blue-600 dark:text-blue-400">Round-trip cost</p>
                <p className="text-xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(cost * 2)}</p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
        <MPGInput />
        {cost == null && miles != null && (
          <p className="text-xs text-gray-400">Add EIA key for cost</p>
        )}
      </div>
    </Card>
  );
}
