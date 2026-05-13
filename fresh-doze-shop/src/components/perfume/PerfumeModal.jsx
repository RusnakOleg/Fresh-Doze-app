import { useState } from "react";
import { VOLUMES } from "../../utils/constants";

const PerfumeModal = ({ perfume, onClose, addToCart }) => {
  const [customVolume, setCustomVolume] = useState("");

  const handleAddCustom = () => {
    addToCart(perfume, customVolume);
    setCustomVolume("");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden relative p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 text-xl"
        >
          ✕
        </button>
        <p className="text-[#00a693] font-black text-[10px] uppercase mb-1">
          {perfume.brand}
        </p>
        <h2 className="text-2xl font-black mb-6">{perfume.name}</h2>

        <div className="mb-6 space-y-4">
          {perfume.notes && (
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">
                Ноти аромату:
              </h4>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-wide italic">
                {perfume.notes}
              </p>
            </div>
          )}
          {perfume.description && (
            <div>
              <h4 className="text-[10px] font-black text-gray-400 uppercase mb-1">
                Про аромат:
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {perfume.description}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-3">
              Стандартні об'єми:
            </h4>
            <div className="grid grid-cols-4 gap-2">
              {VOLUMES.map((v) => (
                <button
                  key={v}
                  onClick={() => addToCart(perfume, v)}
                  className="bg-gray-100 hover:bg-[#00a693] hover:text-white p-2 rounded-xl transition-colors"
                >
                  <div className="text-[10px] font-bold">{v}мл</div>
                  <div className="font-black text-xs">
                    {v === 3 || v === 5
                      ? v * perfume.pricePerMl + 25
                      : v * perfume.pricePerMl + 27}{" "}
                    ₴
                  </div>
                </button>
              ))}
            </div>
          </div>
          {/* Секція власного об'єму */}
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
                  {(Number(customVolume) * perfume.pricePerMl).toFixed(0)} ₴
                </span>
              </div>
            </div>
            {/* Попередження */}
            <p className="text-[9px] text-orange-500 font-bold mt-2 uppercase tracking-tight">
              * Ціна для власного об'єму вказана без вартості флакона
            </p>
          </div>

          <button
            onClick={handleAddCustom}
            disabled={!customVolume || customVolume <= 0}
            className="w-full bg-[#00a693] hover:bg-[#008d7d] text-white py-4 rounded-2xl font-black disabled:opacity-50"
          >
            ДОДАТИ В КОШИК
          </button>
        </div>
      </div>
    </div>
  );
};

export default PerfumeModal;
