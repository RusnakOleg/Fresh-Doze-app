export default function Pagination({
  currentItems,
  totalPages,
  currentPage,
  displayedPagesCount,
  handleShowMore,
  handlePageClick,
  handleNextPage,
}) {
  if (currentItems.length === 0 || totalPages <= 1) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 mt-12 mb-10 flex flex-col items-center gap-6 print:hidden">
      {currentPage + displayedPagesCount - 1 < totalPages && (
        <button
          onClick={handleShowMore}
          className="flex items-center gap-2.5 px-6 py-2 border border-[#00a693]/20 rounded-full text-[#00a693] hover:bg-[#00a693] hover:text-white transition-all duration-300 group shadow-sm"
        >
          <div className="group-hover:rotate-180 transition-transform duration-500">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
          </div>

          <span className="font-black text-[10px] uppercase tracking-widest">
            Показати ще
          </span>
        </button>
      )}

      <div className="flex items-center gap-1 text-[13px]">
        {/* Стрілка вліво */}
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageClick(currentPage - 1)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 disabled:opacity-30 hover:bg-[#00a693] hover:text-white transition-all"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;

            const isSelected =
              page >= currentPage && page < currentPage + displayedPagesCount;

            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 &&
                page <= currentPage + displayedPagesCount)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`w-9 h-9 rounded-xl font-black transition-all border-2 ${
                    isSelected
                      ? "border-[#00a693] text-[#00a693]"
                      : "border-transparent text-gray-400 hover:text-[#00a693]"
                  }`}
                >
                  {page}
                </button>
              );
            }

            if (
              page === currentPage - 2 ||
              page === currentPage + displayedPagesCount + 1
            ) {
              return (
                <span key={page} className="text-gray-300">
                  ...
                </span>
              );
            }

            return null;
          })}
        </div>

        {/* Стрілка вправо */}
        <button
          disabled={currentPage + displayedPagesCount - 1 >= totalPages}
          onClick={handleNextPage}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 disabled:opacity-30 hover:bg-[#00a693] hover:text-white transition-all"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
