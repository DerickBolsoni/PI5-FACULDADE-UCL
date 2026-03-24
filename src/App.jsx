import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { MapView } from "./components/MapView.jsx";
import { AnimalList } from "./components/AnimalList.jsx";
import { FloatingButton } from "./components/FloatingButton.jsx";
import { LocateButton } from "./components/LocateButton.jsx";
import { AnimalFormModal } from "./components/AnimalFormModal.jsx";
import { AllAnimalsModal } from "./components/AllAnimalsModal.jsx";
import { supabase } from "./lib/supabaseClient.js";

function App() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCenter, setCurrentCenter] = useState({ lat: -20.32, lng: -40.29 });
  const [userLocation, setUserLocation] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formLocation, setFormLocation] = useState(null);
  const [allAnimalsOpen, setAllAnimalsOpen] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

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
      />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapView
          animals={animals}
          onMapClickLocation={handleMapClickLocation}
          userLocation={userLocation}
          selectedLocation={formLocation}
          center={currentCenter}
          heatmapEnabled={heatmapEnabled}
        />

        {}
        <aside className="pointer-events-auto absolute inset-x-0 top-4 z-10 mx-auto max-h-[40vh] w-[90%] overflow-hidden rounded-xl border border-slate-800 bg-slate-950/90 shadow-2xl backdrop-blur-md sm:right-4 sm:left-auto sm:top-4 sm:w-80 sm:max-h-[75vh]">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold">Animais próximos</h2>
              <p className="text-[10px] text-slate-400">Clique no mapa para registrar</p>
            </div>
            <span className="rounded-full bg-blue-500/20 px-2 py-0.5 text-[10px] font-bold text-blue-400">
              {animals.length} {animals.length === 1 ? 'PET' : 'PETS'}
            </span>
          </div>
          <div className="h-full overflow-y-auto pb-10">
            <AnimalList
              animals={animals}
              onSelectAnimal={handleSelectAnimalOnMap}
            />
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

export default App;