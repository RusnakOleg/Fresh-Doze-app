import { Copy, TriangleAlert, CreditCard, Truck } from "lucide-react";

const OrderModal = ({ telegramOrderLink, text, onClose }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    alert("Текст скопійовано!");
  };

  return (
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
            value={text}
            className="w-full h-48 p-5 bg-gray-100 rounded-[1.5rem] text-sm font-bold text-gray-700 resize-none border-2 border-transparent focus:border-[#00a693] outline-none leading-relaxed custom-scrollbar"
          />
          {/* Кнопка Копіювати */}
          <button
            onClick={handleCopy}
            className="w-full bg-gray-100 text-[#00a693] py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[#00a693] hover:text-white transition-all flex items-center justify-center gap-2"
          >
            Копіювати текст <Copy size={14} strokeWidth={3} />
          </button>
        </div>

        {/* Блок з попередженням */}
        <div className="mt-4 p-3 bg-orange-50 rounded-xl border border-orange-100">
          <p className="text-[11px] text-orange-700 font-bold leading-tight flex gap-2">
            <span>
              <TriangleAlert size={18} strokeWidth={2.5} />
            </span>
            <span>
              УВАГА: В замовленні для власного об'єму ціна вказана ТІЛЬКИ за
              рідину. Вартість флакона буде додана адміном та зможете побачити
              ії у фінальному чеку.
            </span>
          </p>
        </div>

        {/* Доставка та оплата */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] uppercase font-black tracking-tight">
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-[#00a693] mb-1 h-5">
              <CreditCard size={14} strokeWidth={3} />
              <span>Оплата</span>
            </div>
            <p className="text-gray-500 leading-tight">
              Карта або При отриманні (+3% + 35₴)
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 text-[#00a693] mb-1 h-5">
              <Truck size={14} strokeWidth={3} />
              <span>Доставка</span>
            </div>
            <p className="text-gray-500 leading-tight">
              НП (65₴) / Укрпошта (40₴)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <button
            onClick={onClose}
            className="py-4 rounded-[1.5rem] font-black text-gray-400 text-sm uppercase bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Назад
          </button>
          <button
            onClick={() => window.open(telegramOrderLink, "_blank")}
            className="py-4 bg-[#00a693] text-white rounded-[1.5rem] font-black text-sm uppercase shadow-xl hover:bg-[#008d7d] active:scale-95 transition-all"
          >
            У Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
