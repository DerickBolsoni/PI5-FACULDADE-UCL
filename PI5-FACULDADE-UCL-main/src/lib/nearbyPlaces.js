function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return earthRadiusKm * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function normalizeOverpassElement(element) {
  const center = element.center || element;
  return {
    id: element.id,
    name: element.tags?.name || "Local sem nome",
    lat: center.lat,
    lng: center.lon,
    tags: element.tags || {},
  };
}

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

async function queryOverpass(query) {
  let lastError = null;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" },
        body: `data=${encodeURIComponent(query)}`,
      });

      if (!response.ok) {
        lastError = new Error(`Falha em ${endpoint}: ${response.status}`);
        continue;
      }

      const data = await response.json();
      return (data.elements || []).map(normalizeOverpassElement);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Falha ao consultar Overpass");
}

function getNearestPlace(places, lat, lng) {
  if (!places.length) return null;
  const withDistance = places.map((place) => ({
    ...place,
    distanceKm: distanceKm(lat, lng, place.lat, place.lng),
  }));
  withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  return withDistance[0];
}

export async function getNearbySupportPlaces(lat, lng, radiusMeters = 10000) {
  const vetQuery = `
[out:json][timeout:25];
(
  node["amenity"="veterinary"](around:${radiusMeters},${lat},${lng});
  way["amenity"="veterinary"](around:${radiusMeters},${lat},${lng});
  relation["amenity"="veterinary"](around:${radiusMeters},${lat},${lng});
  node["healthcare"="veterinary"](around:${radiusMeters},${lat},${lng});
  way["healthcare"="veterinary"](around:${radiusMeters},${lat},${lng});
  relation["healthcare"="veterinary"](around:${radiusMeters},${lat},${lng});
  node["name"~"veterin|vet|clinica veterin|clínica veterin",i](around:${radiusMeters},${lat},${lng});
  way["name"~"veterin|vet|clinica veterin|clínica veterin",i](around:${radiusMeters},${lat},${lng});
  relation["name"~"veterin|vet|clinica veterin|clínica veterin",i](around:${radiusMeters},${lat},${lng});
);
out center;
`;

  const ngoQuery = `
[out:json][timeout:25];
(
  node["amenity"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  way["amenity"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  relation["amenity"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  node["office"="ngo"](around:${radiusMeters},${lat},${lng});
  way["office"="ngo"](around:${radiusMeters},${lat},${lng});
  relation["office"="ngo"](around:${radiusMeters},${lat},${lng});
  node["social_facility"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  way["social_facility"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  relation["social_facility"="animal_shelter"](around:${radiusMeters},${lat},${lng});
  node["name"~"ong|protetor|protetora|resgate|abrigo|associação|associacao",i](around:${radiusMeters},${lat},${lng});
  way["name"~"ong|protetor|protetora|resgate|abrigo|associação|associacao",i](around:${radiusMeters},${lat},${lng});
  relation["name"~"ong|protetor|protetora|resgate|abrigo|associação|associacao",i](around:${radiusMeters},${lat},${lng});
);
out center;
`;

  const [vets, ngos] = await Promise.all([queryOverpass(vetQuery), queryOverpass(ngoQuery)]);

  return {
    nearestVet: getNearestPlace(vets, lat, lng),
    nearestNgo: getNearestPlace(ngos, lat, lng),
  };
}

