import PerfumeCard from "./PerfumeCard";

const PerfumeGrid = ({ items, onPerfumeClick }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 font-bold tracking-wide">
          Нічого не знайдено за вашим запитом
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {items.map((p) => (
        <PerfumeCard key={p.id} perfume={p} onClick={onPerfumeClick} />
      ))}
    </div>
  );
};

export default PerfumeGrid;
