import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom"; // Додаємо Link

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin-panel");
    } catch (error) {
      alert("Помилка: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-[3rem] overflow-hidden relative">
        {/* Посилання на головну у вигляді стрілки "Назад" */}
        <Link
          to="/"
          className="absolute top-6 left-6 z-10 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white transition-all backdrop-blur-sm border border-white/20"
          title="На головну"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={3}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </Link>

        {/* Банер */}
        <div className="bg-[#00a693] py-10 px-6 text-center">
          <h1 className="text-4xl font-black text-white italic tracking-tighter">
            FreshDoze
          </h1>
          <p className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mt-2">
            Admin Authentication
          </p>
        </div>

        {/* Форма */}
        <form onSubmit={handleLogin} className="p-10">
          <h2 className="text-xl font-black mb-8 text-gray-800 text-center uppercase tracking-tight">
            Вхід в систему
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">
                Email адреса
              </label>
              <input
                type="email"
                placeholder="admin@freshdoze.com"
                className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#00a693] transition-all"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4 mb-1 block">
                Пароль
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full p-4 bg-gray-100 rounded-2xl border-none outline-none focus:ring-2 focus:ring-[#00a693] transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#00a693] transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 010-.644C3.304 7.552 7.14 4.5 12 4.5c4.857 0 8.696 3.052 9.964 7.178.07.23.07.46 0 .692-1.268 4.126-5.107 7.178-9.964 7.178-4.857 0-8.696-3.052-9.964-7.178z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button className="w-full bg-[#00a693] text-white p-5 rounded-[2rem] font-black mt-10 shadow-xl shadow-[#00a693]/20 hover:bg-[#008d7d] hover:-translate-y-0.5 active:scale-95 transition-all">
            УВІЙТИ В ПАНЕЛЬ
          </button>

          {/* Друга можливість повернутися — текстове посилання під кнопкою */}
          <div className="mt-8 text-center">
            <Link
              to="/"
              className="text-[11px] font-black text-gray-300 uppercase tracking-widest hover:text-[#00a693] transition-colors"
            >
              ← Повернутися до магазину
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
