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

const VOLUMES = [3, 5, 10];

function App() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Фільтрація
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [customVolume, setCustomVolume] = useState("");

  const [orderText, setOrderText] = useState("");

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

  const handleGenerateText = () => {
    let message = "Вітаю! Хочу зробити замовлення:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.brand} ${item.name} — ${item.volume}мл (${item.price} ₴)\n`;
    });
    message += `\nРазом до сплати: ${cartTotal} ₴`;
    // Додаємо примітку
    message += `\n\n*Примітка: ціна за стандартні об'єми (3, 5, 10мл) вже включає вартість флакона. Для власного об'єму ціна вказана тільки за парфуми.`;

    setOrderText(message);
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

  // Логіка кошика
  const addToCart = (perfume, volume) => {
    if (!volume || volume <= 0) return;
    const newItem = {
      cartId: Date.now(),
      id: perfume.id,
      brand: perfume.brand,
      name: perfume.name,
      volume: Number(volume),
      price: volume * perfume.pricePerMl,
    };
    setCart([...cart, newItem]);
    setSelectedPerfume(null);
    setCustomVolume("");
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const generateTelegramMessage = () => {
    let message = "Вітаю! Хочу зробити замовлення:\n\n";
    cart.forEach((item, index) => {
      message += `${index + 1}. ${item.brand} ${item.name} — ${item.volume}мл (${item.price} ₴)\n`;
    });
    message += `\nРазом: ${cartTotal} ₴`;
    return encodeURIComponent(message);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#00a693]">
        Завантаження FRESH DOZE...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 font-sans">
      <>
        {/* Sticky тільки для зеленого банера */}
        <div className="sticky top-0 z-30 bg-[#00a693] py-8 px-6 text-center flex flex-col items-center justify-center  shadow-sm">
          {/* Назва бренду */}
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-md">
            FreshDoze
          </h1>

          {/* Підзаголовок */}
          <p className="text-white/80 text-xs font-bold mt-2 tracking-[0.2em] uppercase">
            Premium Perfume Decants
          </p>

          {/* Кошик */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white text-[#00a693] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center gap-1 hover:scale-110 active:scale-95 transition-all z-10"
          >
            <span className="text-xl">🛒</span>
            <span className="font-black text-sm">{cart.length}</span>
          </button>
        </div>

        {/* Header з пошуком і фільтрами */}
        <header className="bg-white border-b shadow-sm">
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

            {/* Кнопка скидання */}
            {(searchTerm ||
              filterCategory !== "all" ||
              filterBrand !== "all" ||
              sortByPrice !== "none") && (
              <div className="flex justify-center mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-black text-[#00a693] hover:text-[#008d7d] uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <span className="text-sm"></span>
                  Скинути всі фільтри
                </button>
              </div>
            )}
          </div>
        </header>
      </>

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

      {/* MODAL PERFUME */}
      {selectedPerfume && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden relative p-8 shadow-2xl">
            <button
              onClick={() => setSelectedPerfume(null)}
              className="absolute top-6 right-6 text-gray-400 text-xl"
            >
              ✕
            </button>

            <p className="text-[#00a693] font-black text-[10px] uppercase mb-1">
              {selectedPerfume.brand}
            </p>
            <h2 className="text-2xl font-black mb-6">{selectedPerfume.name}</h2>

            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">
                  Стандартні об'єми:
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {VOLUMES.map((v) => (
                    <button
                      key={v}
                      onClick={() => addToCart(selectedPerfume, v)}
                      className="bg-gray-100 hover:bg-[#00a693] hover:text-white p-2 rounded-xl transition-colors"
                    >
                      <div className="text-[10px] font-bold">{v}мл</div>
                      <div className="font-black text-xs">
                        {v == 3 || 5
                          ? v * selectedPerfume.pricePerMl + 25
                          : v * selectedPerfume.pricePerMl + 27}
                        ₴
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* У секції Власний об'єм (мл) */}
              <div>
                <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">
                  Власний об'єм (мл):
                </h4>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Напр. 8"
                    className="flex-1 bg-gray-100 p-3 rounded-xl outline-none focus:ring-2 focus:ring-[#00a693]"
                    value={customVolume}
                    onChange={(e) => setCustomVolume(e.target.value)}
                  />
                  <div className="flex flex-col justify-center px-4 bg-gray-50 rounded-xl border">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">
                      Ціна
                    </span>
                    <span className="font-black">
                      {(
                        Number(customVolume) * selectedPerfume.pricePerMl
                      ).toFixed(0)}{" "}
                      ₴
                    </span>
                  </div>
                </div>

                {/* Додаємо це попередження */}
                <p className="text-[9px] text-orange-500 font-bold mt-2 uppercase tracking-tight">
                  * Ціна для власного об'єму вказана без урахування вартості
                  флакона
                </p>
              </div>

              <button
                onClick={() => addToCart(selectedPerfume, customVolume)}
                disabled={!customVolume || customVolume <= 0}
                className="w-full bg-[#00a693] hover:bg-[#008d7d] text-white py-4 rounded-2xl font-black disabled:opacity-50"
              >
                ДОДАТИ В КОШИК
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART MODAL */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col p-8 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Кошик</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-[#00a693] font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <span className="text-4xl mb-2">🛒</span>
                  <p className="font-bold">Кошик порожній</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.cartId}
                    className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-transparent hover:border-gray-200 transition-all"
                  >
                    <div className="min-w-0 flex-1 mr-4">
                      <p className="text-[10px] font-black text-[#00a693] uppercase truncate">
                        {item.brand}
                      </p>
                      <p className="font-bold text-sm md:text-base truncate">
                        {item.name} ({item.volume}мл)
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-black text-gray-900">
                        {item.price} ₴
                      </span>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="text-red-400 text-[11px] font-bold uppercase hover:underline"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t pt-6 space-y-4">
                <div className="flex justify-between items-center text-xl font-black px-2">
                  <span className="text-gray-400 text-sm uppercase tracking-widest">
                    Разом:
                  </span>
                  <span>{cartTotal} ₴</span>
                </div>
                <button
                  onClick={handleGenerateText}
                  className="w-full bg-[#00a693] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-[#00a693]/20 hover:bg-[#008d7d] active:scale-95 transition-all uppercase tracking-tight"
                >
                  Згенерувати текст замовлення
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL FOR COPYING TEXT */}
      {orderText && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <h3 className="text-xl font-black mb-2 text-gray-900">
              Ваше замовлення готове
            </h3>
            <p className="text-xs text-gray-400 mb-4 font-bold uppercase tracking-wider">
              Скопіюйте текст нижче та надішліть його нам у Telegram
            </p>

            {/* Контейнер тексту */}
            <div className="flex flex-col gap-3">
              <textarea
                readOnly
                value={orderText}
                className="w-full h-48 p-5 bg-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-700 resize-none border-2 border-transparent focus:border-[#00a693] outline-none leading-relaxed custom-scrollbar"
              />
              {/* Кнопка Копіювати тепер під текстом */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(orderText);
                  alert("Текст скопійовано!");
                }}
                className="w-full bg-gray-100 text-[#00a693] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00a693] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                Копіювати текст 📋
              </button>
            </div>

            {/* Блок з попередженням */}
            <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
              <p className="text-[11px] text-orange-700 font-bold leading-tight flex gap-2">
                <span>⚠️</span>
                <span>
                  УВАГА: В замовленні для власного об'єму ціна вказана ТІЛЬКИ за
                  рідину. Вартість флакона буде додана адміном та зможете
                  побачити ії у фінальному чеку.
                </span>
              </p>
            </div>
            {/* Доставка та оплата */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-tight">
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[#00a693] mb-1">💳 Оплата</p>
                <p className="text-gray-500">
                  Карта або При отриманні (+3% + 35₴)
                </p>
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                <p className="text-[#00a693] mb-1">🚚 Доставка</p>
                <p className="text-gray-500">НП (65₴) / Укрпошта (40₴)</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <button
                onClick={() => setOrderText("")}
                className="py-4 rounded-[1.5rem] font-black text-gray-400 text-sm uppercase tracking-widest bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Назад
              </button>
              <button
                onClick={() =>
                  window.open(`https://t.me/your_account`, "_blank")
                }
                className="py-4 bg-[#00a693] text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-[#00a693]/20 hover:bg-[#008d7d] active:scale-95 transition-all"
              >
                У Telegram
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
