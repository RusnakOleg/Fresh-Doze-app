export default function OrderModal({
  isOpen,
  onClose,
  orderItems,
  updateOrderItemMl,
  updateOrderItemBottle,
  removeFromOrder,
  totalSum,
  totalMl,
  clearOrder,
  handlePrint,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm print:hidden">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-2xl font-black">Створення замовлення</h2>

          <button onClick={onClose} className="text-2xl">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="space-y-6">
            {orderItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-start border-b border-dashed pb-4"
              >
                <div className="flex-1">
                  <h4 className="font-bold text-lg leading-tight">
                    {item.brand}
                  </h4>

                  <p className="text-gray-600">{item.name}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Об'єм (мл):
                      </label>

                      <input
                        type="number"
                        value={item.ml}
                        onChange={(e) =>
                          updateOrderItemMl(item.id, e.target.value)
                        }
                        className="w-16 p-2 bg-gray-100 rounded-lg font-bold outline-none focus:ring-2 focus:ring-[#00a693]"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">
                        Флакон (грн):
                      </label>

                      <input
                        type="number"
                        value={item.bottlePrice || 0}
                        onChange={(e) =>
                          updateOrderItemBottle(item.id, e.target.value)
                        }
                        className="w-20 p-2 bg-gray-100 rounded-lg font-bold outline-none focus:ring-2 focus:ring-[#00a693]"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-right min-w-[100px]">
                  <p className="font-black text-lg">{item.totalPrice} ₴</p>

                  <p className="text-xs text-gray-400">
                    {item.ml} мл × {item.pricePerMl}₴
                    <br />+ флакон: {item.bottlePrice || 0}₴
                  </p>

                  <button
                    onClick={() => removeFromOrder(item.id)}
                    className="text-red-400 text-xs mt-2 underline"
                  >
                    Видалити
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gray-900 text-white p-8 rounded-[2rem]">
            <div className="flex justify-between mb-2 opacity-70 text-sm">
              <span>Кількість флаконів:</span>
              <span>{orderItems.length} шт.</span>
            </div>

            <div className="flex justify-between mb-4 opacity-70 text-sm">
              <span>Загальний об'єм:</span>
              <span>{totalMl} мл</span>
            </div>

            <div className="h-[1px] bg-white/20 mb-4"></div>

            <div className="flex justify-between items-end">
              <span className="text-xl font-bold uppercase tracking-tighter">
                Підсумок:
              </span>

              <span className="text-4xl font-black text-[#00a693]">
                {totalSum} ₴
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t flex gap-4">
          <button
            onClick={handlePrint}
            className="flex-1 bg-[#00a693] hover:bg-[#008d7d] text-white p-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all"
          >
            ЗБЕРЕГТИ PDF / ДРУК
          </button>

          <button
            onClick={clearOrder}
            className="px-6 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-2xl font-bold"
          >
            ОЧИСТИТИ
          </button>
        </div>
      </div>
    </div>
  );
}
