import PerfumeCard from "./PerfumeCard";

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
        <PerfumeCard
          key={p.id}
          perfume={p}
          isAdded={orderItems.some((item) => item.id === p.id)}
          onAddToOrder={addToOrder}
          onEdit={startEdit}
          onToggleAvailability={toggleAvailability}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
