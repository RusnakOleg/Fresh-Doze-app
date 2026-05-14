export default function FloatingOrderButton({ orderItems, onOpen }) {
  if (orderItems.length === 0) {
    return null;
  }

  return (
    <button
      onClick={onOpen}
      className="fixed bottom-6 right-6 z-30 bg-black text-white px-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 animate-bounce"
    >
      📦 Оформити замовлення ({orderItems.length})
    </button>
  );
}
