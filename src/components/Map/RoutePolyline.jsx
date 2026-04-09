import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';

// Decode Google-style encoded polyline (used by ORS)
function decodePolyline(encoded) {
  if (!encoded) return [];
  let index = 0, lat = 0, lng = 0;
  const coords = [];
  while (index < encoded.length) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0; result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coords.push([lat / 1e5, lng / 1e5]);
  }
  return coords;
}

export function RoutePolyline({ geometry, origin, destination }) {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    if (geometry) {
      setPositions(decodePolyline(geometry));
    } else if (origin && destination) {
      setPositions([
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ]);
    } else {
      setPositions([]);
    }
  }, [geometry, origin, destination]);

  if (positions.length < 2) return null;

  return (
    <Polyline
      positions={positions}
      pathOptions={{ color: '#1d4ed8', weight: 4, opacity: 0.8 }}
    />
  );
}
