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

const VOLUMES = [3, 5, 10, 15];

function App() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Фільтрація
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

  const uniqueBrands = useMemo(
    () => ["all", ...new Set(perfumes.map((p) => p.brand))],
    [perfumes],
  );

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterBrand("all");
    setSortByPrice("none");
  };

  const filteredItems = useMemo(() => {
    let result = [...perfumes];
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filterCategory !== "all")
      result = result.filter((p) => p.category === filterCategory);
    if (filterBrand !== "all")
      result = result.filter((p) => p.brand === filterBrand);
    result = result.filter((p) => p.isAvailable !== false);

    if (sortByPrice === "low")
      result.sort((a, b) => a.pricePerMl - b.pricePerMl);
    else if (sortByPrice === "high")
      result.sort((a, b) => b.pricePerMl - a.pricePerMl);

    return result;
  }, [perfumes, searchTerm, filterCategory, filterBrand, sortByPrice]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#00a693]">
        Завантаження FRESH DOZE...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 font-sans">
      {/* HEADER WITH BANNER COLORS */}
      <header className="bg-white border-b sticky top-0 z-20 shadow-sm">
        {/* Banner Section */}
        <div className="bg-[#00a693] py-8 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-md">
            FreshDoze
          </h1>
          <p className="text-white/80 text-xs font-bold mt-2 tracking-[0.2em] uppercase">
            Premium Perfume Decants
          </p>
        </div>

        <div className="max-w-6xl mx-auto p-6">
          {/* Пошук та фільтри */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
            <input
              type="text"
              placeholder="Пошук аромату..."
              className="p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693] text-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <select
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00a693] transition-all cursor-pointer"
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
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00a693] transition-all cursor-pointer"
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
              className="p-3 bg-gray-100 rounded-2xl outline-none text-sm font-bold text-gray-600 focus:ring-2 focus:ring-[#00a693] transition-all cursor-pointer"
              value={sortByPrice}
              onChange={(e) => setSortByPrice(e.target.value)}
            >
              <option value="none">Сортування</option>
              <option value="low">Найдешевші</option>
              <option value="high">Найдорожчі</option>
            </select>
          </div>

          {/* Кнопка скидання  */}
          {(searchTerm ||
            filterCategory !== "all" ||
            filterBrand !== "all" ||
            sortByPrice !== "none") && (
            <div className="flex justify-center mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={resetFilters}
                className="text-[10px] font-black text-[#00a693] hover:text-[#008d7d] uppercase tracking-widest flex items-center gap-2 transition-colors"
              >
                <span className="text-sm"></span> Скинути всі фільтри
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 ">
          {filteredItems.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPerfume(p)}
              /* Змінено: bg-gray-100 та rounded-2xl як у пошуку */
              className=" rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative border-2 border-[#00a693]"
            >
              {/* Фото */}
              <div className="aspect-square overflow-hidden flex items-center justify-center p-2">
                <img
                  src={p.imageUrl}
                  className="max-w-full max-h-full object-contain mix-blend-darken transition-transform duration-500 group-hover:scale-105"
                  alt={p.name}
                  loading="lazy"
                />
              </div>

              {/* Текст */}
              <div className="p-4 bg-gray-100">
                <p className="text-[10px] font-black text-[#00a693] uppercase tracking-[0.15em] mb-1">
                  {p.brand}
                </p>
                <h3 className="font-bold text-gray-900 truncate text-sm md:text-base leading-tight">
                  {p.name}
                </h3>

                <div className="flex items-center justify-between mt-3">
                  <p className="text-sm font-black text-gray-800">
                    {p.pricePerMl}{" "}
                    <span className="text-[10px] text-gray-400 font-bold">
                      ₴/мл
                    </span>
                  </p>
                  {/* Невелика біла плашка для контрасту ціни, якщо потрібно */}
                  <div className="w-2 h-2 rounded-full bg-[#00a693]"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL IN RECENT PALETTE --- */}
      {selectedPerfume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setSelectedPerfume(null)}
              className="absolute top-6 right-6 z-10 bg-gray-100 text-gray-400 w-10 h-10 rounded-full flex items-center justify-center font-bold hover:bg-[#00a693] hover:text-white transition-colors"
            >
              ✕
            </button>

            <div className="p-10">
              <p className="text-[#00a693] font-black tracking-widest text-[10px] uppercase mb-2">
                {selectedPerfume.brand}
              </p>
              <h2 className="text-3xl font-black text-gray-900 mb-6 leading-tight">
                {selectedPerfume.name}
              </h2>

              <div className="mb-8">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">
                  Про аромат:
                </h4>
                <p className="text-gray-600 leading-relaxed text-sm">
                  {selectedPerfume.description ||
                    "Неймовірний аромат, що підкреслить вашу індивідуальність."}
                </p>
              </div>

              <div className="mb-10">
                <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">
                  Оберіть об'єм:
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {VOLUMES.map((v) => (
                    <button
                      key={v}
                      className="bg-gray-50 border-2 border-transparent rounded-3xl px-4 py-4 text-center hover:border-[#00a693] hover:bg-[#00a693]/5 transition-all group"
                    >
                      <p className="text-[10px] font-bold text-gray-400 group-hover:text-[#00a693] mb-1">
                        {v} мл
                      </p>
                      <p className="font-black text-gray-900">
                        {v * selectedPerfume.pricePerMl} ₴
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
                className="w-full bg-[#00a693] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-[#00a693]/20 hover:bg-[#008d7d] transition-all active:scale-95"
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
