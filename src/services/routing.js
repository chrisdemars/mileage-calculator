import { haversineDistance } from '../utils/geo.js';

export async function getDrivingDistance(origin, destination) {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;
  if (!apiKey) {
    return { miles: haversineDistance(origin, destination), isFallback: true, geometry: null };
  }

  const res = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      coordinates: [
        [origin.lng, origin.lat],
        [destination.lng, destination.lat],
      ],
    }),
  });

  if (!res.ok) {
    return { miles: haversineDistance(origin, destination), isFallback: true, geometry: null };
  }

  const data = await res.json();
  const meters = data.routes[0].summary.distance;
  const geometry = data.routes[0].geometry; // encoded polyline
  return { miles: meters * 0.000621371, isFallback: false, geometry };
}

export async function geocodeAddress(query) {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;
  const base = 'https://nominatim.openstreetmap.org/search';
  const url = `${base}?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;

  const res = await fetch(url, {
    headers: { 'Accept-Language': 'en' },
  });
  if (!res.ok) throw new Error('Geocoding failed');
  const results = await res.json();
  return results.map((r) => ({
    label: r.display_name,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  }));
}
