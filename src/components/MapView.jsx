import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo } from "react";

const iconColors = {
  low: "#22c55e",
  medium: "#eab308",
  high: "#ef4444",
};

function createCircleIcon(color) {
  return L.divIcon({
    className: "custom-marker",
    html: `<span style="
      display:inline-block;
      width:18px;
      height:18px;
      border-radius:999px;
      border:2px solid white;
      box-shadow:0 0 0 2px rgba(15,23,42,0.8);
      background:${color};
    "></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function ClickHandler({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation?.({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const handleResize = () => {
      map.invalidateSize();
    };

    handleResize();
    const t1 = setTimeout(handleResize, 300);
    const t2 = setTimeout(handleResize, 1000);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map]);

  return null;
}

function RecenterOnLocation({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng]);
      map.invalidateSize();
      const t = setTimeout(() => {
        map.invalidateSize();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [center, map]);

  return null;
}

export function MapView({
  animals,
  onMapClickLocation,
  center = { lat: -23.55052, lng: -46.633308 },
  initialZoom = 13,
}) {
  const markers = useMemo(
    () =>
      animals?.map((animal) => ({
        ...animal,
        icon: createCircleIcon(iconColors[animal.urgencia] || iconColors.medium),
      })) || [],
    [animals]
  );

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={initialZoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <ResizeHandler />
        <RecenterOnLocation center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClickHandler onSelectLocation={onMapClickLocation} />

        {markers.map((animal) => (
          <Marker
            key={animal.id}
            position={[animal.lat, animal.lng]}
            icon={animal.icon}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {animal.nome || "Animal sem nome"}
                </p>
                <p className="text-xs">{animal.descricao}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

