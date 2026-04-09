import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

const originIcon = L.divIcon({
  html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:#16a34a;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);transform:rotate(-45deg)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

const destinationIcon = L.divIcon({
  html: `<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;background:#dc2626;border:3px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4);transform:rotate(-45deg)"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  className: '',
});

export function LocationMarker({ position, type, onDragEnd }) {
  const icon = type === 'origin' ? originIcon : destinationIcon;
  const label = type === 'origin' ? 'Origin location' : 'Destination location';

  return (
    <Marker
      position={[position.lat, position.lng]}
      icon={icon}
      draggable
      aria-label={label}
      eventHandlers={{
        dragend: (e) => {
          const { lat, lng } = e.target.getLatLng();
          onDragEnd({ lat, lng });
        },
      }}
    >
      <Popup>{label}</Popup>
    </Marker>
  );
}
