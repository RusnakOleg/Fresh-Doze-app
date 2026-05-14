import { ShoppingCart } from "lucide-react";

const CartModal = ({
  cart,
  cartTotal,
  removeFromCart,
  onClose,
  onGenerateText,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden max-h-[90vh] flex flex-col p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">Кошик</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-[#00a693] font-bold text-xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-6 pr-2 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <ShoppingCart
                size={48}
                strokeWidth={1.8}
                className="mb-3 opacity-20"
              />
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
              onClick={onGenerateText}
              className="w-full bg-[#00a693] text-white py-5 rounded-[2rem] font-black shadow-xl shadow-[#00a693]/20 hover:bg-[#008d7d] active:scale-95 transition-all uppercase tracking-tight"
            >
              Згенерувати текст замовлення
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
