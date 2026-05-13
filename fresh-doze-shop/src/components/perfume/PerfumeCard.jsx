const PerfumeCard = ({ perfume, onClick }) => {
  return (
    <div
      onClick={() => onClick(perfume)}
      className="rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative border-2 border-[#00a693] flex flex-col h-full bg-white"
    >
      {/* Фото */}
      <div className="aspect-square overflow-hidden flex items-center justify-center p-2">
        <img
          src={perfume.imageUrl}
          className="max-w-full max-h-full object-contain mix-blend-darken transition-transform duration-500 group-hover:scale-105"
          alt={perfume.name}
          loading="lazy"
        />
      </div>
      {/* Текстовий блок  */}
      <div className="p-4 bg-gray-100 flex-1 flex flex-col justify-between">
        <div>
          <p className="text-[10px] font-black text-[#00a693] uppercase tracking-[0.15em] mb-1">
            {perfume.brand}
          </p>
          <h3 className="font-bold text-gray-900 truncate text-sm md:text-base leading-tight">
            {perfume.name}
          </h3>
          <p className="text-[8px] text-orange-500 font-bold uppercase mt-1 line-clamp-1 tracking-wider min-h-[12px]">
            {perfume.notes || ""}
          </p>
        </div>
        <div className="flex items-center justify-between mt-3">
          <p className="text-sm font-black text-gray-800">
            {perfume.pricePerMl}{" "}
            <span className="text-[10px] text-gray-400 font-bold">₴/мл</span>
          </p>
          {/* Невелика біла плашка для контрасту ціни */}
          <div className="w-2 h-2 rounded-full bg-[#00a693]"></div>
        </div>
      </div>
    </div>
  );
};

export default PerfumeCard;
