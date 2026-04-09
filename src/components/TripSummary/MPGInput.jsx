import { useTrip } from '../../context/TripContext.jsx';

export function MPGInput() {
  const { state, dispatch } = useTrip();

  const handleChange = (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      dispatch({ type: 'SET_MPG', payload: val });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="mpg-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        MPG
      </label>
      <input
        id="mpg-input"
        type="number"
        min="1"
        max="200"
        step="1"
        value={state.mpg}
        onChange={handleChange}
        className="w-20 rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />
    </div>
  );
}
