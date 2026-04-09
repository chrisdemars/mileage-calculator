import { useState, useEffect } from 'react';
import { fetchMichiganGasPrice } from '../services/gasPrice.js';

const CACHE_KEY = 'mi_gas_price';
const TTL_MS = 24 * 60 * 60 * 1000;

export function useGasPrice() {
  const [price, setPrice] = useState(null);
  const [date, setDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.timestamp < TTL_MS) {
        setPrice(cached.value);
        setDate(cached.date);
        return;
      }
      const result = await fetchMichiganGasPrice();
      setPrice(result.value);
      setDate(result.date);
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ value: result.value, date: result.date, timestamp: Date.now() })
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return { price, date, loading, error, retry: load };
}
