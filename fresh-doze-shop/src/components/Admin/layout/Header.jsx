import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";

export default function Header() {
  return (
    <header className="bg-white border-b sticky top-0 z-20 shadow-sm print:hidden">
      <div className="bg-[#00a693] py-8 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-md">
          FreshDoze
        </h1>

        <p className="text-white/80 text-xs font-bold mt-2 tracking-[0.2em] uppercase">
          ADMIN PANEL
        </p>

        <button
          onClick={() => signOut(auth)}
          className="absolute top-4 right-4 bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-xl text-xs font-bold hover:bg-white hover:text-[#00a693] transition-all"
        >
          Вийти
        </button>
      </div>
    </header>
  );
}
