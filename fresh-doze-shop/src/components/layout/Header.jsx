import { ShoppingCart, Flame } from "lucide-react";
import { CATEGORIES } from "../../utils/constants";
import TopBar from "./TopBar";

const Header = ({
  cartCount,
  setIsCartOpen,
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterBrand,
  setFilterBrand,
  sortByPrice,
  setSortByPrice,
  uniqueBrands,
  resetFilters,
  telegramChannelLink,
}) => {
  return (
    <>
      {/* TOP TELEGRAM BAR */}
      <TopBar telegramChannelLink={telegramChannelLink} Flame={Flame} />

      {/* GREEN STICKY BANNER */}
      <div className="sticky top-[37px] z-30 bg-[#00a693] py-6 px-4 text-center flex flex-col items-center justify-center min-h-[80px] shadow-sm">
        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-md">
          FreshDoze
        </h1>
        <p className="text-white/80 text-xs font-bold mt-2 tracking-[0.2em] uppercase">
          Premium Perfume Decants
        </p>
        {/* Кошик */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 bg-white text-[#00a693] w-12 h-12 md:w-14 md:h-14 rounded-full shadow-xl flex items-center justify-center gap-1 hover:scale-110 active:scale-95 transition-all z-10"
        >
          <ShoppingCart size={22} strokeWidth={2.5} />
          <span className="font-black text-sm">{cartCount}</span>
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
                Скинути всі фільтри
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
