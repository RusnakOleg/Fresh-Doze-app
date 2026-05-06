import { useEffect, useState, useMemo } from "react";
import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

const CATEGORIES = [
  { id: "all", name: "Всі" },
  { id: "men", name: "Чоловічі" },
  { id: "women", name: "Жіночі" },
  { id: "niche", name: "Нішеві" },
  { id: "arabic", name: "Арабські" },
];

const VOLUMES = [3, 5, 10, 20];

function App() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Стейт фільтрації ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  const [selectedPerfume, setSelectedPerfume] = useState(null);

  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "perfumes"));
        setPerfumes(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPerfumes();
  }, []);

  // Отримуємо унікальні бренди для селекту
  const uniqueBrands = useMemo(() => {
    return ["all", ...new Set(perfumes.map((p) => p.brand))];
  }, [perfumes]);

  // --- Логіка фільтрації ---
  const filteredItems = useMemo(() => {
    let result = [...perfumes];

    // 1. Пошук
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. Категорія
    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // 3. Бренд
    if (filterBrand !== "all") {
      result = result.filter((p) => p.brand === filterBrand);
    }

    // 4. Наявність (тільки доступні для користувачів)
    result = result.filter((p) => p.isAvailable !== false);

    // 5. Сортування
    if (sortByPrice === "low") {
      result.sort((a, b) => a.pricePerMl - b.pricePerMl);
    } else if (sortByPrice === "high") {
      result.sort((a, b) => b.pricePerMl - a.pricePerMl);
    }

    return result;
  }, [perfumes, searchTerm, filterCategory, filterBrand, sortByPrice]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold">
        Завантаження...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 text-gray-900">
      <header className="bg-white border-b p-6 sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black italic tracking-tighter">
              FRESH <span className="text-blue-600 font-black">DOZE</span>
            </h1>
          </div>

          {/* Пошук та фільтри */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Пошук аромату або бренду..."
              className="md:col-span-1 p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
            >
              <option value="all">Усі бренди</option>
              {uniqueBrands
                .filter((b) => b !== "all")
                .map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </select>

            <select
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-medium focus:ring-2 focus:ring-blue-500"
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
            >
              <option value="none">Сортування ціни</option>
              <option value="low">Дешевші спочатку</option>
              <option value="high">Дорожчі спочатку</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-center mb-6 px-2">
          <h2 className="text-xl font-bold">
            Знайдено: {filteredItems.length}
          </h2>
          {(searchTerm ||
            filterCategory !== "all" ||
            filterBrand !== "all" ||
            sortByPrice !== "none") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("all");
                setFilterBrand("all");
                setSortByPrice("none");
              }}
              className="text-sm text-blue-600 font-bold hover:underline"
            >
              Скинути все
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredItems.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPerfume(p)}
              className="bg-white rounded-[32px] border border-gray-100 overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="relative overflow-hidden aspect-square bg-gray-50">
                <img
                  src={p.imageUrl}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  alt={p.name}
                />
              </div>
              <div className="p-5">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                  {p.brand}
                </p>
                <h3 className="font-bold text-gray-900 truncate leading-tight">
                  {p.name}
                </h3>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-lg font-black text-gray-900">
                    {p.pricePerMl}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">
                    грн/мл
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold text-lg italic">
              Нічого не знайдено..
            </p>
          </div>
        )}
      </main>

      {/* Модалка (без змін, тільки додана плавна анімація кнопки) */}
      {selectedPerfume && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          {/* Код модалки з вашого попереднього повідомлення */}
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedPerfume(null)}
              className="absolute top-6 right-6 z-10 bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center font-bold"
            >
              ✕
            </button>
            <div className="p-10">
              <p className="text-blue-600 font-bold tracking-widest text-xs uppercase mb-1">
                {selectedPerfume.brand}
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                {selectedPerfume.name}
              </h2>
              <div className="mb-8">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Про аромат:
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {selectedPerfume.description || "Опис скоро з'явиться..."}
                </p>
              </div>
              <div className="mb-10">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Оберіть об'єм:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {VOLUMES.map((v) => (
                    <button
                      key={v}
                      className="bg-gray-50 border border-gray-100 rounded-3xl px-4 py-4 text-center "
                    >
                      <p className="text-[10px] font-bold text-gray-400 group-hover:text-blue-400 mb-1">
                        {v} мл
                      </p>
                      <p className="font-black text-gray-900 group-hover:text-blue-700">
                        {v * selectedPerfume.pricePerMl + 25} ₴
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() =>
                  window.open(
                    `https://t.me/your_account?text=Хочу замовити ${selectedPerfume.brand} ${selectedPerfume.name}`,
                    "_blank",
                  )
                }
                className="w-full bg-blue-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all"
              >
                ЗАМОВИТИ У TELEGRAM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
