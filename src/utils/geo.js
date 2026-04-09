const R = 3958.8; // Earth radius in miles

export function haversineDistance(origin, destination) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(destination.lat - origin.lat);
  const dLng = toRad(destination.lng - origin.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(origin.lat)) * Math.cos(toRad(destination.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function coordsEqual(a, b) {
  if (!a || !b) return false;
  return a.lat === b.lat && a.lng === b.lng;
}
