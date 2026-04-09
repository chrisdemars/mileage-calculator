import { useState, useEffect } from 'react';
import { getDrivingDistance } from '../services/routing.js';
import { coordsEqual } from '../utils/geo.js';

export function useRouting(origin, destination) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!origin || !destination) {
      setResult(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDrivingDistance(origin, destination);
        if (!cancelled) setResult(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [
    origin?.lat, origin?.lng,
    destination?.lat, destination?.lng,
  ]);

  return { result, loading, error };
}
