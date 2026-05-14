import { CATEGORIES } from "../../../utils/constants";

export default function PerfumeForm({
  name,
  setName,
  brand,
  setBrand,
  price,
  setPrice,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  category,
  setCategory,
  notes,
  setNotes,
  editId,
  handleSubmit,
  resetForm,
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10"
    >
      <h2 className="text-xl font-black mb-6 text-gray-800">
        {editId ? " Редагувати аромат" : " Додати новий аромат"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Бренд"
          className="p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693]"
        />

        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва"
          className="p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693]"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-4 bg-gray-100 rounded-2xl outline-none font-bold text-gray-600 focus:ring-2 focus:ring-[#00a693]"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} парфумерія
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Опис..."
        className="w-full mt-4 p-4 bg-gray-100 rounded-2xl h-24 outline-none focus:ring-2 focus:ring-[#00a693]"
      />

      <input
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Нотатки (напр. Схожий на Baccarat Rouge чи Хіт продажу!)"
        className="w-full mt-4 p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <input
          required
          value={price}
          type="number"
          min="0"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ціна за мл"
          className="p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693]"
        />

        <input
          required
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL картинки"
          className="p-4 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-[#00a693]"
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          className={`flex-1 p-5 rounded-[2rem] font-black text-white transition shadow-lg ${
            editId
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-[#00a693] hover:bg-[#008d7d]"
          }`}
        >
          {editId ? "ОНОВИТИ ДАНІ" : "ЗБЕРЕГТИ В БАЗУ"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={resetForm}
            className="px-8 bg-gray-200 hover:bg-gray-300 rounded-[2rem] font-black"
          >
            СКАСУВАТИ
          </button>
        )}
      </div>
    </form>
  );
}
