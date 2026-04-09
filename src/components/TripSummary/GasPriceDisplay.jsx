import { useGasPrice } from '../../hooks/useGasPrice.js';
import { formatGasPrice } from '../../utils/formatters.js';
import { Spinner } from '../ui/Spinner.jsx';
import { Button } from '../ui/Button.jsx';

export function GasPriceDisplay() {
  const { price, date, loading, error, retry } = useGasPrice();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Spinner size="sm" /> Fetching MI gas price…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
        <span>Gas price unavailable</span>
        <Button variant="ghost" size="sm" onClick={retry}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="rounded-full bg-blue-100 px-2.5 py-0.5 font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-200">
        {formatGasPrice(price)}
      </span>
      <span className="text-gray-500 dark:text-gray-400">
        MI avg · {date ? `as of ${date}` : ''} · EIA
      </span>
    </div>
  );
}
