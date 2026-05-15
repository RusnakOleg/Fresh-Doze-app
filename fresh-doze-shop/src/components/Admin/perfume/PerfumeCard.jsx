import { PencilLine, Trash2 } from "lucide-react";
import { CATEGORIES } from "../../../utils/constants";

export default function PerfumeCard({
  perfume,
  isAdded,
  onAddToOrder,
  onEdit,
  onToggleAvailability,
  onDelete,
}) {
  const categoryName = CATEGORIES.find((c) => c.id === perfume.category)?.name;

  return (
    <div
      className={`flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-[#00a693] rounded-3xl transition-all hover:shadow-md ${
        !perfume.isAvailable && "opacity-50"
      }`}
    >
      <img
        src={perfume.imageUrl || "https://via.placeholder.com/150"}
        className="w-20 h-20 object-contain rounded-2xl border border-[#00a693]"
        alt={perfume.name}
      />

      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
          <span className="text-[9px] font-black uppercase text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
            {categoryName}
          </span>

          {perfume.notes && (
            <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
              {perfume.notes}
            </span>
          )}
        </div>

        <h3 className="font-bold text-gray-900">
          {perfume.brand} {perfume.name}
        </h3>

        <p className="text-[#00a693] font-black text-sm">
          {perfume.pricePerMl} грн/мл
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAddToOrder(perfume)}
          className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
            isAdded
              ? "bg-[#00a693] text-white"
              : "bg-black text-white hover:bg-[#00a693]"
          }`}
        >
          {isAdded ? "✓ ДОДАНО" : "+ В ЧЕК"}
        </button>

        <button
          onClick={() => onEdit(perfume)}
          className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
        >
          <PencilLine size={18} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => onToggleAvailability(perfume.id, perfume.isAvailable)}
          className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${
            perfume.isAvailable
              ? "bg-[#00a693]/10 text-[#00a693]"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          {perfume.isAvailable ? "В наявності" : "Немає"}
        </button>

        <button
          onClick={() => onDelete(perfume.id)}
          className="p-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
