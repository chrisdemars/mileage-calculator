import { useEffect } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTrip } from '../../context/TripContext.jsx';
import { LocationMarker } from './LocationMarker.jsx';
import { RoutePolyline } from './RoutePolyline.jsx';

// Fix Leaflet default icon path issue with Vite
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const MICHIGAN_CENTER = [44.3148, -85.6024];
const DEFAULT_ZOOM = 7;

function MapClickHandler() {
  const { state, dispatch } = useTrip();
  useMapEvents({
    click(e) {
      const coords = { lat: e.latlng.lat, lng: e.latlng.lng };
      if (state.nextMarker === 'origin') {
        dispatch({ type: 'SET_ORIGIN', payload: coords });
      } else {
        dispatch({ type: 'SET_DESTINATION', payload: coords });
      }
    },
  });
  return null;
}

export function MapView({ routeGeometry }) {
  const { state, dispatch } = useTrip();

  return (
    <MapContainer
      center={MICHIGAN_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-[60vh] w-full rounded-xl"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapClickHandler />
      {state.origin && (
        <LocationMarker
          position={state.origin}
          type="origin"
          onDragEnd={(coords) => dispatch({ type: 'SET_ORIGIN', payload: coords })}
        />
      )}
      {state.destination && (
        <LocationMarker
          position={state.destination}
          type="destination"
          onDragEnd={(coords) => dispatch({ type: 'SET_DESTINATION', payload: coords })}
        />
      )}
      {state.origin && state.destination && (
        <RoutePolyline
          geometry={routeGeometry}
          origin={state.origin}
          destination={state.destination}
        />
      )}
    </MapContainer>
  );
}
