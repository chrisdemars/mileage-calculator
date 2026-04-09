import { createContext, useContext, useReducer } from 'react';

const TripContext = createContext(null);

const DEFAULT_MPG = 28;

const initialState = {
  origin: null,
  destination: null,
  mpg: DEFAULT_MPG,
  nextMarker: 'origin', // 'origin' | 'destination'
};

function tripReducer(state, action) {
  switch (action.type) {
    case 'SET_ORIGIN':
      return { ...state, origin: action.payload, nextMarker: 'destination' };
    case 'SET_DESTINATION':
      return { ...state, destination: action.payload, nextMarker: 'origin' };
    case 'SET_MPG':
      return { ...state, mpg: action.payload };
    case 'SET_NEXT_MARKER':
      return { ...state, nextMarker: action.payload };
    case 'CLEAR':
      return { ...initialState };
    default:
      return state;
  }
}

export function TripProvider({ children }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);
  return (
    <TripContext.Provider value={{ state, dispatch }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error('useTrip must be used within TripProvider');
  return ctx;
}
