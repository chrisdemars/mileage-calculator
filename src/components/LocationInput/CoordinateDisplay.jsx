export function CoordinateDisplay({ coords, label }) {
  if (!coords) return null;
  return (
    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {label}: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
    </p>
  );
}
