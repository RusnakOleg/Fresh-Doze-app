import { PencilLine, Trash2 } from "lucide-react";
import { CATEGORIES } from "../../../utils/constants";

export default function PerfumeList({
  currentItems,
  orderItems,
  addToOrder,
  startEdit,
  toggleAvailability,
  handleDelete,
}) {
  if (currentItems.length === 0) {
    return (
      <div className="text-center py-10 bg-white rounded-[2.5rem] border border-dashed border-gray-200">
        <p className="text-gray-400 font-bold tracking-wide">
          Нічого не знайдено за вашим запитом
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {currentItems.map((p) => (
        <div
          key={p.id}
          className={`flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-[#00a693] rounded-3xl transition-all hover:shadow-md ${
            !p.isAvailable && "opacity-50"
          }`}
        >
          <img
            src={p.imageUrl || "https://via.placeholder.com/150"}
            className="w-20 h-20 object-contain rounded-2xl border border-[#00a693]"
            alt=""
          />

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-1">
              <span className="text-[9px] font-black uppercase text-[#00a693] bg-[#00a693]/10 px-2 py-0.5 rounded">
                {CATEGORIES.find((c) => c.id === p.category)?.name}
              </span>

              {p.notes && (
                <span className="text-[9px] font-black uppercase text-orange-500 bg-orange-50 px-2 py-0.5 rounded">
                  {p.notes}
                </span>
              )}
            </div>

            <h3 className="font-bold text-gray-900">
              {p.brand} {p.name}
            </h3>

            <p className="text-[#00a693] font-black text-sm">
              {p.pricePerMl} грн/мл
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => addToOrder(p)}
              className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                orderItems.find((item) => item.id === p.id)
                  ? "bg-[#00a693] text-white"
                  : "bg-black text-white hover:bg-[#00a693]"
              }`}
            >
              {orderItems.find((item) => item.id === p.id)
                ? "✓ ДОДАНО"
                : "+ В ЧЕК"}
            </button>

            <button
              onClick={() => startEdit(p)}
              className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-orange-500 hover:text-white transition-colors"
            >
              <PencilLine size={18} strokeWidth={2.5} />
            </button>

            <button
              onClick={() => toggleAvailability(p.id, p.isAvailable)}
              className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition ${
                p.isAvailable
                  ? "bg-[#00a693]/10 text-[#00a693]"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {p.isAvailable ? "В наявності" : "Немає"}
            </button>

            <button
              onClick={() => handleDelete(p.id)}
              className="p-3 bg-gray-50 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
