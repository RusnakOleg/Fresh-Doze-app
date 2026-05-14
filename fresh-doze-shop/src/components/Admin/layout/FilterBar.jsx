import { CATEGORIES } from "../../../utils/constants";

export default function FilterBar({
  listTopRef,
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
}) {
  return (
    <div
      ref={listTopRef}
      className="bg-gray-100 p-6 rounded-[2rem] mb-8 scroll-mt-24"
    >
      {/* Грід тільки для полів вводу */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <input
          placeholder="Пошук..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-3 bg-white rounded-xl outline-none text-sm focus:ring-2 focus:ring-[#00a693]"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="p-3 bg-white rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-[#00a693]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
          className="p-3 bg-white rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-[#00a693]"
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
          value={sortByPrice}
          onChange={(e) => setSortByPrice(e.target.value)}
          className="p-3 bg-white rounded-xl outline-none text-sm font-bold focus:ring-2 focus:ring-[#00a693]"
        >
          <option value="none">Сортування</option>
          <option value="low">Дешевші</option>
          <option value="high">Дорожчі</option>
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
            className="text-[10px] font-black text-[#00a693] hover:text-[#008d7d] uppercase tracking-widest flex items-center gap-2 transition-colors py-2"
          >
            Скинути всі фільтри
          </button>
        </div>
      )}
    </div>
  );
}
