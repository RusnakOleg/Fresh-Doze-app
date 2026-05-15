export default function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center font-bold text-[#00a693]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[#00a693] border-t-transparent rounded-full animate-spin"></div>
        <p className="tracking-widest uppercase text-xs">
          Завантаження FRESH DOZE...
        </p>
      </div>
    </div>
  );
}
