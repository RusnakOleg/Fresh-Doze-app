import { useState, useEffect, useMemo } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [perfumes, setPerfumes] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Стейт форми
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("men");
  const [editId, setEditId] = useState(null);

  // --- Стейт для Фільтрів та Пошуку ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  const CATEGORIES = [
    { id: "men", name: "Чоловіча" },
    { id: "women", name: "Жіноча" },
    { id: "niche", name: "Нішева" },
    { id: "arabic", name: "Арабська" },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else {
        setUser(currentUser);
        fetchPerfumes();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const fetchPerfumes = async () => {
    const querySnapshot = await getDocs(collection(db, "perfumes"));
    setPerfumes(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  // --- Логіка Фільтрації ---
  const filteredPerfumes = useMemo(() => {
    let result = [...perfumes];

    // 1. Пошук (по назві або бренду)
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. Фільтр по категорії
    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }

    // 3. Фільтр по конкретному бренду
    if (filterBrand !== "all") {
      result = result.filter((p) => p.brand === filterBrand);
    }

    // 4. Сортування за ціною
    if (sortByPrice === "low") {
      result.sort((a, b) => a.pricePerMl - b.pricePerMl);
    } else if (sortByPrice === "high") {
      result.sort((a, b) => b.pricePerMl - a.pricePerMl);
    }

    return result;
  }, [perfumes, searchTerm, filterCategory, filterBrand, sortByPrice]);

  // Отримуємо список унікальних брендів для фільтра
  const uniqueBrands = useMemo(() => {
    return ["all", ...new Set(perfumes.map((p) => p.brand))];
  }, [perfumes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !price) return alert("Заповни всі поля");

    const perfumeData = {
      name,
      brand,
      description,
      imageUrl,
      category,
      pricePerMl: Number(price),
      isAvailable: true,
    };

    if (editId) {
      await updateDoc(doc(db, "perfumes", editId), perfumeData);
      setEditId(null);
    } else {
      await addDoc(collection(db, "perfumes"), perfumeData);
    }

    resetForm();
    fetchPerfumes();
  };

  const resetForm = () => {
    setName("");
    setBrand("");
    setPrice("");
    setDescription("");
    setImageUrl("");
    setCategory("men");
    setEditId(null);
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setName(p.name);
    setBrand(p.brand);
    setPrice(p.pricePerMl);
    setDescription(p.description || "");
    setImageUrl(p.imageUrl || "");
    setCategory(p.category || "men");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Видалити цей аромат?")) {
      await deleteDoc(doc(db, "perfumes", id));
      fetchPerfumes();
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    await updateDoc(doc(db, "perfumes", id), { isAvailable: !currentStatus });
    fetchPerfumes();
  };

  if (!user) return null;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          FRESH DOZE <span className="text-blue-600">ADMIN</span>
        </h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-50 transition"
        >
          Вийти
        </button>
      </div>

      {/* ФОРМА ДОДАВАННЯ/РЕДАГУВАННЯ */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-10"
      >
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {editId ? " Редагування" : " Новий аромат"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Бренд (напр. Tom Ford)"
            className="p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Назва (напр. Lost Cherry)"
            className="p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} парфумерія
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис аромату..."
          className="w-full mt-4 p-3 bg-gray-50 border rounded-2xl h-24 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <input
            value={price}
            type="number"
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Ціна за мл"
            className="p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="URL картинки"
            className="p-3 bg-gray-50 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2 mt-6">
          <button
            className={`flex-1 p-4 rounded-2xl font-bold text-white transition shadow-lg ${editId ? "bg-orange-500" : "bg-black"}`}
          >
            {editId ? "Оновити товар" : "Додати в базу"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-6 bg-gray-200 rounded-2xl font-bold"
            >
              Скасувати
            </button>
          )}
        </div>
      </form>

      {/* --- БЛОК ФІЛЬТРІВ ТА ПОШУКУ --- */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Пошук */}
          <div className="flex-1 relative">
            {/* <span className="absolute left-3 top-3.5 text-gray-400">🔍</span> */}
            <input
              type="text"
              placeholder="Пошук за назвою або брендом..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Фільтр категорій */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            <option value="all">Усі категорії</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Фільтр брендів */}
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium "
          >
            <option value="all">Усі бренди</option>
            {uniqueBrands
              .filter((b) => b !== "all")
              .map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>

          {/* Сортування по ціні */}
          <select
            value={sortByPrice}
            onChange={(e) => setSortByPrice(e.target.value)}
            className="p-3 bg-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
          >
            <option value="none">Сортування</option>
            <option value="low">Дешевші спочатку</option>
            <option value="high">Дорожчі спочатку</option>
          </select>
        </div>
      </div>

      {/* СПИСОК */}
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-bold text-gray-800">
          Результати ({filteredPerfumes.length})
        </h2>
        {(searchTerm || filterCategory !== "all" || filterBrand !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterCategory("all");
              setFilterBrand("all");
              setSortByPrice("none");
            }}
            className="text-xs text-blue-600 font-bold hover:underline"
          >
            Скинути всі фільтри
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {filteredPerfumes.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col md:flex-row justify-between items-center p-4 bg-white border rounded-3xl shadow-sm transition hover:shadow-md ${!p.isAvailable && "opacity-50"}`}
          >
            <div className="flex items-center gap-4 w-full">
              <img
                src={p.imageUrl || "https://via.placeholder.com/150"}
                className="w-20 h-20 object-cover rounded-2xl bg-gray-100"
              />
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-1 rounded-md">
                  {CATEGORIES.find((c) => c.id === p.category)?.name || "Інше"}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  {p.brand} {p.name}
                </h3>
                <p className="text-gray-500 font-semibold">
                  {p.pricePerMl} грн/мл
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 md:mt-0 w-full md:w-auto">
              <button
                onClick={() => startEdit(p)}
                className="p-3 bg-gray-50 text-orange-500 rounded-2xl hover:bg-orange-50"
              >
                ✏️
              </button>
              <button
                onClick={() => toggleAvailability(p.id, p.isAvailable)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold transition ${p.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
              >
                {p.isAvailable ? "В наявності" : "Немає"}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-3 bg-gray-50 text-red-400 rounded-2xl hover:bg-red-50"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
        {filteredPerfumes.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-medium">
              Нічого не знайдено за вашим запитом..
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
