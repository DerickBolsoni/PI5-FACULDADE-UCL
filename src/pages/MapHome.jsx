import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar.jsx";
import { MapView } from "../components/MapView.jsx";
import { AnimalList } from "../components/AnimalList.jsx";
import { FloatingButton } from "../components/FloatingButton.jsx";
import { LocateButton } from "../components/LocateButton.jsx";
import { AnimalFormModal } from "../components/AnimalFormModal.jsx";
import { AllAnimalsModal } from "../components/AllAnimalsModal.jsx";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient.js";

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

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
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
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
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
        />
        <aside
          className={`
            pointer-events-auto
            absolute
            bottom-0 left-0 right-0
            z-10
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
            />
            <div className="h-28 sm:hidden" />
          </div>
        </aside>
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
      />
    </div>
  );
}
