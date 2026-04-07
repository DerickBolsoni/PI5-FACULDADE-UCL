import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
function HeatLayer({ points, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !points?.length || !L.heatLayer) return;
    const heatData = points
      .filter((p) => p.lat != null && p.lng != null)
      .map((p) => [p.lat, p.lng, 1.0]);
    const heat = L.heatLayer(heatData, {
      radius: 35,
      blur: 20,
      maxZoom: 12,
      gradient: {
        0.2: "rgba(255, 255, 0, 0.4)",
        0.5: "rgba(255, 165, 0, 0.6)",
        0.8: "rgba(255, 0, 0, 0.7)",
        1.0: "rgba(128, 0, 128, 0.8)",
      },
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [map, points, enabled]);

  return null;
}

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (!onMapClick || !e?.latlng) return;
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    contextmenu(e) {
      if (!onMapClick || !e?.latlng) return;
      onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });

  return null;
}

function MapSync({ center }) {
  const map = useMap();

  useEffect(() => {
    if (center?.lat && center?.lng) {
      map.setView([center.lat, center.lng], Math.max(map.getZoom(), 12), {
        animate: true,
      });
    }
  }, [map, center]);

  return null;
}

const TILE_LIGHT = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
};

const TILE_DARK = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attr: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
};

function getMarkerIcon(urgencia) {
  const colors = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444",
  };
  const color = colors[urgencia] || colors.low;

  return divIcon({
    html: `<div style="width:18px;height:18px;border-radius:50%;background-color:${color};border:2px solid #fff;box-shadow:0 0 8px ${color};"></div>`,
    className: "",
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
}

export function MapView({
  animals,
  onMapClickLocation,
  userLocation,
  selectedLocation,
  center,
  heatmapEnabled,
  darkMap,
}) {
  return (
    <MapContainer
      center={center ? [center.lat, center.lng] : [-20.32, -40.29]}
      zoom={13}
      zoomControl={false}
      style={{ width: "100%", height: "100%" }}
      whenCreated={(map) => {
        map.zoomControl.setPosition("bottomright");
      }}
    >
      <TileLayer
        key={darkMap ? "dark" : "light"}
        attribution={darkMap ? TILE_DARK.attr : TILE_LIGHT.attr}
        url={darkMap ? TILE_DARK.url : TILE_LIGHT.url}
      />

      <HeatLayer
        points={animals}
        enabled={heatmapEnabled}
      />

      {animals
        .filter((a) => a.lat != null && a.lng != null)
        .map((animal) => (
          <Marker
            key={animal.id ?? `${animal.lat}-${animal.lng}`}
            position={[animal.lat, animal.lng]}
            icon={getMarkerIcon(animal.urgencia)}
          >
            <Popup>
              <strong>{animal.nome || "Sem nome"}</strong>
              <br />
              {animal.descricao && <span>{animal.descricao}</span>}
            </Popup>
          </Marker>
        ))}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={divIcon({
            html: `
              <div style="position:relative;width:24px;height:24px;">
                <div class="pulse-ring" style="position:absolute;top:0;left:0;width:24px;height:24px;border-radius:50%;border:3px solid #3b82f6;animation:pulse-ring 1.4s cubic-bezier(0.215,0.61,0.355,1) infinite;"></div>
                <div class="pulse-dot" style="position:absolute;top:4px;left:4px;width:16px;height:16px;border-radius:50%;background-color:#3b82f6;border:3px solid #fff;animation:pulse-dot 1.4s cubic-bezier(0.215,0.61,0.355,1) infinite;"></div>
              </div>
            `,
            className: "",
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        >
          <Popup>Sua localização</Popup>
        </Marker>
      )}

      {selectedLocation && (
        <Marker
          position={[selectedLocation.lat, selectedLocation.lng]}
          icon={divIcon({
            html: `<div style="width:20px;height:20px;border-radius:50%;background-color:#8b5cf6;border:3px solid #fff;box-shadow:0 0 12px #8b5cf6;"></div>`,
            className: "",
            iconSize: [26, 26],
            iconAnchor: [13, 13],
          })}
        />
      )}

      <MapClickHandler onMapClick={onMapClickLocation} />
      <MapSync center={center} />
    </MapContainer>
  );
}
