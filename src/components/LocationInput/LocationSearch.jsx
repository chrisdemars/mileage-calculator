import { useState, useRef, useEffect } from 'react';
import { geocodeAddress } from '../../services/routing.js';
import { Spinner } from '../ui/Spinner.jsx';

export function LocationSearch({ id, label, value, onSelect, placeholder }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (val.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await geocodeAddress(val);
        setSuggestions(results);
        setOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  };

  const handleSelect = (result) => {
    setQuery(result.label.split(',')[0]);
    setSuggestions([]);
    setOpen(false);
    onSelect(result);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-8 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        {loading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <Spinner size="sm" className="text-blue-600" />
          </div>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800"
        >
          {suggestions.map((s, i) => (
            <li
              key={i}
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(s)}
              className="cursor-pointer px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
