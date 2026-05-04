import { useEffect, useRef, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { MapView } from "../components/MapView.jsx";
import { AnimalList } from "../components/AnimalList.jsx";
import { FloatingButton } from "../components/FloatingButton.jsx";
import { LocateButton } from "../components/LocateButton.jsx";
import { AnimalFormModal } from "../components/AnimalFormModal.jsx";
import { AllAnimalsModal } from "../components/AllAnimalsModal.jsx";
import { RouteOriginModal } from "../components/RouteOriginModal.jsx";
import { CollectAnimalModal } from "../components/CollectAnimalModal.jsx";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

function getLocationFromPosition(position) {
  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
    speed: Number.isFinite(position.coords.speed) ? position.coords.speed : null,
  };
}

export function MapHome() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCenter, setCurrentCenter] = useState({ lat: -20.32, lng: -40.29 });
  const [userLocation, setUserLocation] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLocation, setFormLocation] = useState(null);
  const [allAnimalsOpen, setAllAnimalsOpen] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [darkMap, setDarkMap] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [routeTarget, setRouteTarget] = useState(null);
  const [routeModeActive, setRouteModeActive] = useState(false);
  const [routeOriginModalOpen, setRouteOriginModalOpen] = useState(false);
  const [pendingRouteAnimal, setPendingRouteAnimal] = useState(null);
  const [collectModalOpen, setCollectModalOpen] = useState(false);
  const [collectAnimalTarget, setCollectAnimalTarget] = useState(null);
  const [collectLoading, setCollectLoading] = useState(false);
  const routeWatchIdRef = useRef(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = getLocationFromPosition(pos);
          setUserLocation(loc);
          setCurrentCenter(loc);
        },
        () => {
          console.log("GPS negado ou indisponível. Usando centro padrão.");
        }
      );
    }
  }, []);

  useEffect(() => {
    if (!routeModeActive || !("geolocation" in navigator)) {
      if (routeWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(routeWatchIdRef.current);
        routeWatchIdRef.current = null;
      }
      return;
    }

    routeWatchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const liveLoc = getLocationFromPosition(pos);
        setUserLocation(liveLoc);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 4000 }
    );

    return () => {
      if (routeWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(routeWatchIdRef.current);
        routeWatchIdRef.current = null;
      }
    };
  }, [routeModeActive]);

  useEffect(() => {
    const fetchAnimals = async () => {
      if (!isSupabaseConfigured || !supabase) return;
      const { data, error } = await supabase
        .from("animais")
        .select("*")
        .order("criado_em", { ascending: false });

      if (!error && data) {
        setAnimals(data);
      }
    };
    fetchAnimals();
  }, []);

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = getLocationFromPosition(pos);
      setUserLocation(loc);
      setCurrentCenter(loc);
    });
  };

  const handleMapClickLocation = (loc) => {
    setFormLocation(loc);
    setFormOpen(true);
  };

  const handleSelectAnimalOnMap = (animal) => {
    if (!animal?.lat || !animal?.lng) return;
    setCurrentCenter({ lat: animal.lat, lng: animal.lng });
  };

  const handleRouteToAnimal = (animal) => {
    if (!animal?.lat || !animal?.lng) return;

    const setRoute = (originLocation) => {
      setRouteModeActive(true);
      setUserLocation(originLocation);
      setRouteTarget({
        id: animal.id,
        lat: animal.lat,
        lng: animal.lng,
        nome: animal.nome,
      });
      setCurrentCenter({
        lat: (originLocation.lat + animal.lat) / 2,
        lng: (originLocation.lng + animal.lng) / 2,
      });
    };

    if (userLocation?.lat && userLocation?.lng) {
      setRoute(userLocation);
      return;
    }

    if (!("geolocation" in navigator)) {
      setPendingRouteAnimal(animal);
      setRouteOriginModalOpen(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = getLocationFromPosition(pos);
        setRoute(loc);
      },
      () => {
        setPendingRouteAnimal(animal);
        setRouteOriginModalOpen(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  };

  const handleOpenExternalNavigation = (animal) => {
    if (!animal?.lat || !animal?.lng) return;
    const destination = `${animal.lat},${animal.lng}`;
    const wazeUrl = `https://www.waze.com/ul?ll=${encodeURIComponent(destination)}&navigate=yes`;
    window.open(wazeUrl, "_blank", "noopener,noreferrer");
  };

  const handleConfirmManualOrigin = (origin) => {
    if (!pendingRouteAnimal?.lat || !pendingRouteAnimal?.lng) {
      setRouteOriginModalOpen(false);
      return;
    }

    const loc = { lat: origin.lat, lng: origin.lng };
    setUserLocation(loc);
    setRouteModeActive(true);
    setRouteTarget({
      id: pendingRouteAnimal.id,
      lat: pendingRouteAnimal.lat,
      lng: pendingRouteAnimal.lng,
      nome: pendingRouteAnimal.nome,
    });
    setCurrentCenter({
      lat: (loc.lat + pendingRouteAnimal.lat) / 2,
      lng: (loc.lng + pendingRouteAnimal.lng) / 2,
    });
    setRouteOriginModalOpen(false);
    setPendingRouteAnimal(null);
  };

  const handleExitRouteMode = () => {
    setRouteModeActive(false);
    setRouteTarget(null);
  };

  const handleOpenCollectModal = (animal) => {
    if (!animal?.id) return;
    setCollectAnimalTarget(animal);
    setCollectModalOpen(true);
  };

  const handleConfirmCollected = async (photoFile) => {
    if (!collectAnimalTarget?.id || !photoFile || !supabase) return;

    try {
      setCollectLoading(true);

      const fileName = `${crypto.randomUUID()}.${photoFile.name.split(".").pop()}`;
      const uploadPath = `coletas/${collectAnimalTarget.id}/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("animais_fotos")
        .upload(uploadPath, photoFile);
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("animais_fotos").getPublicUrl(uploadPath);

      const collectedAt = new Date().toISOString();
      let updatedRow = null;

      const firstUpdate = await supabase
        .from("animais")
        .update({
          status: "coletado",
          coletado: true,
          coletado_em: collectedAt,
          coleta_foto_url: publicUrl,
        })
        .eq("id", collectAnimalTarget.id)
        .select()
        .single();

      if (!firstUpdate.error && firstUpdate.data) {
        updatedRow = firstUpdate.data;
      } else {
        const previousDescription = collectAnimalTarget.descricao || "";
        const collectNote = `[COLETADO em ${new Date(collectedAt).toLocaleString("pt-BR")}] Foto: ${publicUrl}`;
        const descriptionWithNote = previousDescription.includes("[COLETADO")
          ? previousDescription
          : `${previousDescription}${previousDescription ? "\n\n" : ""}${collectNote}`;

        const fallbackUpdate = await supabase
          .from("animais")
          .update({
            descricao: descriptionWithNote,
          })
          .eq("id", collectAnimalTarget.id)
          .select()
          .single();

        if (fallbackUpdate.error) throw fallbackUpdate.error;
        updatedRow = {
          ...fallbackUpdate.data,
          status: "coletado",
          coletado: true,
          coletado_em: collectedAt,
          coleta_foto_url: publicUrl,
        };
      }

      setAnimals((prev) =>
        prev.map((animal) => (animal.id === collectAnimalTarget.id ? { ...animal, ...updatedRow } : animal))
      );
      setCollectModalOpen(false);
      setCollectAnimalTarget(null);
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel confirmar a coleta. Verifique a conexao e as permissoes do banco.");
    } finally {
      setCollectLoading(false);
    }
  };

  const handleSubmitAnimal = async (formData) => {
    if (!isSupabaseConfigured || !supabase) {
      alert("Supabase não configurado. Crie o arquivo .env.local para salvar.");
      return;
    }
    try {
      setLoading(true);
      let foto_url = null;

      if (formData.fotoFile) {
        const fileName = `${crypto.randomUUID()}.${formData.fotoFile.name.split(".").pop()}`;
        const { error: uploadError } = await supabase.storage
          .from("animais_fotos")
          .upload(`animais/${fileName}`, formData.fotoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("animais_fotos")
          .getPublicUrl(`animais/${fileName}`);
        foto_url = publicUrl;
      }

      const { data, error } = await supabase
        .from("animais")
        .insert([{
          nome: formData.nome,
          descricao: formData.descricao,
          urgencia: formData.urgencia,
          foto_url,
          lat: formData.lat,
          lng: formData.lng,
        }])
        .select()
        .single();

      if (error) throw error;

      setAnimals((prev) => [data, ...prev]);
      setFormOpen(false);
      setFormLocation(null);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar. Verifique sua conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar
        onOpenAllAnimals={() => setAllAnimalsOpen(true)}
        heatmapEnabled={heatmapEnabled}
        onToggleHeatmap={() => setHeatmapEnabled((prev) => !prev)}
        darkMap={darkMap}
        onToggleDarkMap={() => setDarkMap((prev) => !prev)}
      />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapView
          animals={animals}
          onMapClickLocation={handleMapClickLocation}
          userLocation={userLocation}
          selectedLocation={formLocation}
          center={currentCenter}
          heatmapEnabled={heatmapEnabled}
          darkMap={darkMap}
          routeTarget={routeTarget}
          routeModeActive={routeModeActive}
        />
        <aside
          className={`
            pointer-events-auto
            absolute
            bottom-0 left-0 right-0
            z-[1200]
            flex flex-col
            transition-all duration-300
            ${expanded ? "h-[70vh]" : "h-auto max-h-[20vh]"}
            bg-slate-950/95
            border-t border-slate-800
            rounded-t-2xl
            shadow-2xl
            backdrop-blur-md
            sm:top-4 sm:bottom-auto sm:left-auto sm:right-4 sm:w-80 sm:h-auto sm:max-h-[75vh] sm:rounded-xl
          `}
        >
          {/* Barrinha */}
          <div className="flex justify-center py-2">
            <div className="h-1 w-10 rounded-full bg-slate-600"></div>
          </div>

          {/* Cabeçalho clicável */}
          <div
            onClick={() => setExpanded(!expanded)}
            className="flex shrink-0 items-center justify-between px-4 py-3 border-b border-slate-800 cursor-pointer"
          >
            <div>
              <h2 className="text-sm font-semibold">Animais próximos</h2>
              <p className="text-[10px] text-slate-400">
                Clique para expandir
              </p>
            </div>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              {animals.length} {animals.length === 1 ? "PET" : "PETS"}
            </span>
          </div>

          {/* Lista com scroll */}
          <div
            className={`
              overflow-y-auto overflow-x-hidden min-h-0
              ${expanded ? "opacity-100 flex-1 pb-24 pt-2" : "max-h-0 opacity-0 pointer-events-none"}
              transition-all duration-300
            `}
            style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 #1e293b" }}
          >
            <AnimalList
              animals={animals}
              onSelectAnimal={handleSelectAnimalOnMap}
              onRouteToAnimal={handleRouteToAnimal}
              onOpenExternalNavigation={handleOpenExternalNavigation}
              onCollectAnimal={handleOpenCollectModal}
            />
            <div className="h-28 sm:hidden" />
          </div>
        </aside>

        {routeModeActive && (
          <div className="pointer-events-none absolute left-3 top-3 z-[1400]">
            <div className="pointer-events-auto flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-3 py-2 shadow-lg">
              <span className="text-xs font-semibold text-emerald-300">Modo rota ativo</span>
              <button
                type="button"
                onClick={handleExitRouteMode}
                className="rounded-md border border-slate-600 px-2 py-1 text-[11px] font-semibold text-slate-200 hover:bg-slate-800"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </main>

      <FloatingButton onClick={() => setFormOpen(true)} />
      <LocateButton onClick={handleUseCurrentLocation} />

      <AnimalFormModal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setFormLocation(null); }}
        onSubmit={handleSubmitAnimal}
        defaultLocation={formLocation}
        loading={loading}
      />

      <AllAnimalsModal
        isOpen={allAnimalsOpen}
        onClose={() => setAllAnimalsOpen(false)}
        animals={animals}
        onSelectAnimal={handleSelectAnimalOnMap}
        onCollectAnimal={handleOpenCollectModal}
      />

      <RouteOriginModal
        isOpen={routeOriginModalOpen}
        destinationName={pendingRouteAnimal?.nome}
        onClose={() => {
          setRouteOriginModalOpen(false);
          setPendingRouteAnimal(null);
        }}
        onConfirmLocation={handleConfirmManualOrigin}
      />

      <CollectAnimalModal
        isOpen={collectModalOpen}
        animal={collectAnimalTarget}
        loading={collectLoading}
        onClose={() => {
          if (collectLoading) return;
          setCollectModalOpen(false);
          setCollectAnimalTarget(null);
        }}
        onConfirm={handleConfirmCollected}
      />
    </div>
  );
}
