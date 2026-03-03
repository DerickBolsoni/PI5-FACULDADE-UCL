import { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar.jsx";
import { MapView } from "./components/MapView.jsx";
import { AnimalList } from "./components/AnimalList.jsx";
import { FloatingButton } from "./components/FloatingButton.jsx";
import { LocateButton } from "./components/LocateButton.jsx";
import { AnimalFormModal } from "./components/AnimalFormModal.jsx";
import { supabase } from "./lib/supabaseClient.js";

function App() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentCenter, setCurrentCenter] = useState({
    lat: -23.55052,
    lng: -46.633308,
  });
  const [formOpen, setFormOpen] = useState(false);
  const [formLocation, setFormLocation] = useState(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCenter({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        () => {
          // silenciosamente usa o fallback padrão
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
      } else {
        // eslint-disable-next-line no-console
        console.error("Erro ao buscar animais", error);
      }
    };

    fetchAnimals();
  }, []);

  const handleOpenForm = () => {
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
  };

  const handleUseCurrentLocation = () => {
    if (!("geolocation" in navigator)) {
      alert("Geolocalização não suportada neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setFormLocation(loc);
        setCurrentCenter(loc);
      },
      () => {
        alert("Não foi possível obter sua localização.");
      }
    );
  };

  const handleMapClickLocation = (loc) => {
    setFormLocation(loc);
  };

  const handleSubmitAnimal = async ({
    nome,
    descricao,
    urgencia,
    fotoFile,
    lat,
    lng,
  }) => {
    try {
      setLoading(true);

      let foto_url = null;

      if (fotoFile) {
        const fileExt = fotoFile.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const filePath = `animais/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("animais-fotos")
          .upload(filePath, fotoFile);

        if (uploadError) {
          throw uploadError;
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from("animais-fotos").getPublicUrl(filePath);

        foto_url = publicUrl;
      }

      const { data, error } = await supabase
        .from("animais")
        .insert([
          {
            nome,
            descricao,
            urgencia,
            foto_url,
            lat,
            lng,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAnimals((prev) => [data, ...prev]);
      setFormOpen(false);
      setFormLocation(null);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert("Erro ao registrar animal. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-slate-950 text-slate-50">
      <Navbar />

      <main className="relative min-h-0 flex-1 overflow-hidden">
        <MapView
          animals={animals}
          onMapClickLocation={handleMapClickLocation}
          center={currentCenter}
        />

        <aside className="pointer-events-auto absolute inset-x-0 bottom-0 z-10 max-h-64 border-t border-slate-800 bg-slate-950/95 sm:inset-y-0 sm:right-0 sm:top-auto sm:bottom-0 sm:w-80 sm:border-l sm:border-t-0">
          <div className="flex items-center justify-between px-4 pt-3">
            <div>
              <h2 className="text-sm font-semibold">Animais próximos</h2>
              <p className="text-[11px] text-slate-400">
                Lista dos registros recentes na região
              </p>
            </div>
            <span className="text-xs text-slate-400">
              {animals.length}{" "}
              {animals.length === 1 ? "animal" : "animais"}
            </span>
          </div>
          <div className="h-full overflow-y-auto pb-4">
            <AnimalList animals={animals} />
          </div>
        </aside>
      </main>

      <FloatingButton onClick={handleOpenForm} />
      <LocateButton onClick={handleUseCurrentLocation} />

      <AnimalFormModal
        isOpen={formOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitAnimal}
        onRequestLocation={handleUseCurrentLocation}
        defaultLocation={formLocation}
        loading={loading}
      />
    </div>
  );
}

export default App;

