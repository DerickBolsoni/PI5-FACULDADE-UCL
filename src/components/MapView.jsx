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
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

const iconColors = {
  low: "#22c55e",      
  medium: "#eab308",   
  high: "#ef4444",     
  user: "#3b82f6",     
  selected: "#a855f7", 
};


function createCircleIcon(color, isUser = false) {
  const size = isUser ? 22 : 18;
  return L.divIcon({
    className: "custom-marker",
    html: `<span style="
      display:inline-block;
      width:${size}px;
      height:${size}px;
      border-radius:999px;
      border:3px solid white;
      box-shadow: 0 0 10px rgba(15, 23, 42, 0.3);
      background:${color};
      ${isUser ? 'animation: pulse 2s infinite;' : ''}
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function buildGoogleMapsRouteUrl(lat, lng) {
  const destination = `${lat},${lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
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


function RecenterOnLocation({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.flyTo([center.lat, center.lng], 15, {
        duration: 1.5
      });
    }
  }, [center, map]);
  return null;
}

function HeatmapLayer({ animals, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !animals?.length) return undefined;
    const points = animals
      .filter((animal) => animal?.lat && animal?.lng)
      .map((animal) => [
        animal.lat,
        animal.lng,
        animal.urgencia === "high" ? 1 : animal.urgencia === "medium" ? 0.7 : 0.45,
      ]);

    if (!points.length) return undefined;
    const layer = L.heatLayer(points, {
      radius: 28,
      blur: 18,
      maxZoom: 17,
      minOpacity: 0.35,
      gradient: {
        0.2: "#22c55e",
        0.45: "#eab308",
        0.8: "#f97316",
        1.0: "#ef4444",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, animals, enabled]);

  return null;
}

export function MapView({
  animals,
  onMapClickLocation,
  userLocation,      
  selectedLocation,  
  center,            
  heatmapEnabled,
  initialZoom = 13,
}) {
  const userIcon = useMemo(() => createCircleIcon(iconColors.user, true), []);
  const selectedIcon = useMemo(() => createCircleIcon(iconColors.selected), []);

  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={[center?.lat || -20.32, center?.lng || -40.29]}
        zoom={initialZoom}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {}
        <RecenterOnLocation center={center} />
        <ClickHandler onSelectLocation={onMapClickLocation} />
        <HeatmapLayer animals={animals} enabled={heatmapEnabled} />

        {}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center font-medium">Você está aqui</div>
            </Popup>
          </Marker>
        )}

        {}
        {selectedLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={selectedIcon}>
            <Popup>Local selecionado para cadastro</Popup>
          </Marker>
        )}

        {}
        {animals?.map((animal) => (
          <Marker
            key={animal.id}
            position={[animal.lat, animal.lng]}
            icon={createCircleIcon(iconColors[animal.urgencia] || iconColors.medium)}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900">
                  {animal.nome || "Animal sem nome"}
                </p>
                <p className="text-xs text-slate-600">{animal.descricao}</p>
                <div className={`text-[10px] font-bold uppercase ${
                  animal.urgencia === 'high' ? 'text-red-600' : 'text-slate-500'
                }`}>
                  Urgência: {animal.urgencia}
                </div>
                <a
                  href={buildGoogleMapsRouteUrl(animal.lat, animal.lng)}
                  target="_blank"
                  rel="noreferrer"
                  className={`mt-1 inline-flex rounded-md border px-2 py-1 text-[10px] font-semibold ${
                    animal.urgencia === "high"
                      ? "border-red-500/40 text-red-600"
                      : animal.urgencia === "medium"
                        ? "border-amber-500/40 text-amber-600"
                        : "border-emerald-500/40 text-emerald-600"
                  }`}
                >
                  Me levar até lá
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0); }
        }
      `}} />
    </div>
  );
}