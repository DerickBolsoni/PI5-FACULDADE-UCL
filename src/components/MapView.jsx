import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
function HeatLayer({ points, enabled }) {
  const map = useMap();

  useEffect(() => {
    if (!enabled || !points?.length) return;

    let cancelled = false;
    let heat = null;

    const mountHeatLayer = async () => {
      try {
        if (!L.heatLayer) {
          if (typeof window !== "undefined" && !window.L) {
            window.L = L;
          }
          await import("leaflet.heat");
        }

        if (cancelled || !L.heatLayer) return;

        const heatData = points
          .filter((p) => p.lat != null && p.lng != null)
          .map((p) => [p.lat, p.lng, 1.0]);

        heat = L.heatLayer(heatData, {
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
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn("Nao foi possivel carregar o plugin de heatmap.", error);
      }
    };

    mountHeatLayer();

    return () => {
      cancelled = true;
      if (heat) {
        map.removeLayer(heat);
      }
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

function RouteFit({ routeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (!routeCoordinates?.length) return;
    const bounds = L.latLngBounds(routeCoordinates);
    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 16,
      animate: true,
    });
  }, [map, routeCoordinates]);

  return null;
}

function RouteModeMapLock({ active }) {
  const map = useMap();

  useEffect(() => {
    if (!active) {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      if (map.tap) map.tap.enable();
      return;
    }

    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    if (map.tap) map.tap.disable();
  }, [map, active]);

  return null;
}

function RouteFollowUser({ active, userLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!active || !userLocation?.lat || !userLocation?.lng) return;
    const speed = Number.isFinite(userLocation.speed) ? userLocation.speed : null;
    const zoom = speed == null
      ? 18
      : speed < 1.4
        ? 18.5
        : speed < 4
          ? 17.8
          : speed < 8.3
            ? 17.1
            : speed < 13.9
              ? 16.5
              : 16;

    map.setView([userLocation.lat, userLocation.lng], zoom, { animate: true });
  }, [map, active, userLocation]);

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
  routeTarget,
  routeModeActive,
}) {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const routeCacheRef = useRef(new Map());

  useEffect(() => {
    if (!userLocation?.lat || !userLocation?.lng || !routeTarget?.lat || !routeTarget?.lng) {
      setRouteCoordinates([]);
      return;
    }

    const fromKey = `${userLocation.lat.toFixed(5)},${userLocation.lng.toFixed(5)}`;
    const toKey = `${routeTarget.lat.toFixed(5)},${routeTarget.lng.toFixed(5)}`;
    const cacheKey = `${fromKey}->${toKey}`;
    const cachedRoute = routeCacheRef.current.get(cacheKey);

    if (cachedRoute) {
      setRouteCoordinates(cachedRoute);
      return;
    }

    const controller = new AbortController();

    async function loadRoute() {
      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${routeTarget.lng},${routeTarget.lat}?overview=full&geometries=geojson&steps=false`;
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("Falha ao consultar rota");
        const data = await response.json();
        const coordinates = data?.routes?.[0]?.geometry?.coordinates;
        if (!coordinates?.length) {
          setRouteCoordinates([]);
          return;
        }

        const latLngCoordinates = coordinates.map(([lng, lat]) => [lat, lng]);
        routeCacheRef.current.set(cacheKey, latLngCoordinates);
        setRouteCoordinates(latLngCoordinates);
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.error("Erro ao carregar rota:", error);
          setRouteCoordinates([]);
        }
      }
    }

    loadRoute();
    return () => controller.abort();
  }, [userLocation, routeTarget]);

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

      {routeCoordinates.length > 1 && (
        <>
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#22c55e",
              weight: 6,
              opacity: 0.92,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          {!routeModeActive && <RouteFit routeCoordinates={routeCoordinates} />}
        </>
      )}

      <MapClickHandler onMapClick={onMapClickLocation} />
      <MapSync center={center} />
      <RouteModeMapLock active={routeModeActive} />
      <RouteFollowUser active={routeModeActive} userLocation={userLocation} />
    </MapContainer>
  );
}
