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
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);

  // Стейт фільтрів
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  // --- НОВИЙ СТЕЙТ ДЛЯ ЗАМОВЛЕННЯ ---
  const [orderItems, setOrderItems] = useState([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

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

  // --- ЛОГІКА ЗАМОВЛЕННЯ ---
  const addToOrder = (perfume) => {
    if (orderItems.find((item) => item.id === perfume.id)) return;
    setOrderItems([
      ...orderItems,
      { ...perfume, ml: 3, totalPrice: perfume.pricePerMl * 3 },
    ]);
    setIsOrderModalOpen(true);
  };

  const updateOrderItemMl = (id, ml) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newMl = Number(ml);
          return { ...item, ml: newMl, totalPrice: item.pricePerMl * newMl };
        }
        return item;
      }),
    );
  };

  const removeFromOrder = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const totalSum = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalMl = orderItems.reduce((acc, item) => acc + item.ml, 0);

  const handlePrint = () => {
    window.print();
  };

  // ... (Ваші існуючі фільтри та функції handleSubmit, delete тощо залишаються такими ж)
  const filteredPerfumes = useMemo(() => {
    let result = [...perfumes];
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (filterCategory !== "all")
      result = result.filter((p) => p.category === filterCategory);
    if (filterBrand !== "all")
      result = result.filter((p) => p.brand === filterBrand);
    if (sortByPrice === "low")
      result.sort((a, b) => a.pricePerMl - b.pricePerMl);
    else if (sortByPrice === "high")
      result.sort((a, b) => b.pricePerMl - a.pricePerMl);
    return result;
  }, [perfumes, searchTerm, filterCategory, filterBrand, sortByPrice]);

  const uniqueBrands = useMemo(
    () => ["all", ...new Set(perfumes.map((p) => p.brand))],
    [perfumes],
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !brand || !price) return alert("Заповни всі поля");
    const perfumeData = {
      name,
      brand,
      description,
      imageUrl,
      category,
      notes,
      pricePerMl: Number(price),
    };
    if (editId) {
      await updateDoc(doc(db, "perfumes", editId), perfumeData);
      setEditId(null);
    } else {
      await addDoc(collection(db, "perfumes"), {
        ...perfumeData,
        isAvailable: true,
      });
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
    setNotes("");
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
    setNotes(p.notes || "");
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
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* ПРИХОВУЄМО ВСЕ ПРИ ДРУЦІ, КРІМ ЧЕКА */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      <header className="bg-white border-b sticky top-0 z-20 shadow-sm print:hidden">
        <div className="bg-[#00a693] py-8 px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-white italic tracking-tighter">
            FreshDoze
          </h1>
          <p className="text-white/80 text-xs font-bold mt-2 uppercase tracking-[0.2em]">
            ADMIN PANEL
          </p>
          <button
            onClick={() => signOut(auth)}
            className="absolute top-4 right-4 bg-white/20 text-white border border-white/30 px-4 py-1.5 rounded-xl text-xs font-bold"
          >
            Вийти
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 mt-8 print:hidden">
        {/* Кнопка відкриття кошика (якщо там щось є) */}
        {orderItems.length > 0 && (
          <button
            onClick={() => setIsOrderModalOpen(true)}
            className="fixed bottom-6 right-6 z-30 bg-black text-white px-8 py-4 rounded-full shadow-2xl font-bold flex items-center gap-3 animate-bounce"
          >
            📦 Оформити замовлення ({orderItems.length})
          </button>
        )}

        {/* ФОРМА (як у вас була) */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 mb-10"
        >
          <h2 className="text-xl font-black mb-6 text-gray-800">
            {editId ? " Редагувати аромат" : " Додати новий аромат"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Бренд"
              className="p-4 bg-gray-100 rounded-2xl outline-none"
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Назва"
              className="p-4 bg-gray-100 rounded-2xl outline-none"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="p-4 bg-gray-100 rounded-2xl outline-none font-bold text-gray-600"
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
            placeholder="Опис..."
            className="w-full mt-4 p-4 bg-gray-100 rounded-2xl h-24 outline-none"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <input
              value={price}
              type="number"
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Ціна за мл"
              className="p-4 bg-gray-100 rounded-2xl outline-none"
            />
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="URL картинки"
              className="p-4 bg-gray-100 rounded-2xl outline-none"
            />
          </div>
          <button
            className={`w-full mt-6 p-5 rounded-[2rem] font-black text-white transition ${editId ? "bg-orange-500" : "bg-[#00a693]"}`}
          >
            {editId ? "ОНОВИТИ" : "ЗБЕРЕГТИ"}
          </button>
        </form>

        {/* ФІЛЬТРИ */}
        <div className="bg-gray-100 p-6 rounded-[2rem] mb-8 grid grid-cols-1 md:grid-cols-4 gap-3">
          <input
            placeholder="Пошук..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-3 bg-white rounded-xl outline-none"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 bg-white rounded-xl outline-none font-bold"
          >
            <option value="all">Усі категорії</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={filterBrand}
            onChange={(e) => setFilterBrand(e.target.value)}
            className="p-3 bg-white rounded-xl outline-none font-bold"
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
          <select
            value={sortByPrice}
            onChange={(e) => setSortByPrice(e.target.value)}
            className="p-3 bg-white rounded-xl outline-none font-bold"
          >
            <option value="none">Сортування</option>
            <option value="low">Дешевші</option>
            <option value="high">Дорожчі</option>
          </select>
        </div>

        {/* СПИСОК */}
        <div className="flex flex-col gap-4">
          {filteredPerfumes.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col md:flex-row items-center gap-4 p-4 bg-white border border-[#00a693]/20 rounded-3xl transition-all hover:border-[#00a693] ${!p.isAvailable && "opacity-50"}`}
            >
              <img
                src={p.imageUrl || "https://via.placeholder.com/150"}
                className="w-20 h-20 object-cover rounded-2xl bg-gray-100"
                alt=""
              />
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">
                  {p.brand} {p.name}
                </h3>
                <p className="text-[#00a693] font-black text-sm">
                  {p.pricePerMl} грн/мл
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => addToOrder(p)}
                  className={`px-4 py-2 rounded-2xl text-xs font-black transition-all ${
                    orderItems.find((item) => item.id === p.id)
                      ? "bg-[#00a693] text-white" // Зелена, якщо вже в чеку
                      : "bg-black text-white hover:bg-[#00a693]" // Чорна, якщо ще немає
                  }`}
                >
                  {orderItems.find((item) => item.id === p.id)
                    ? "✓ ДОДАНО"
                    : "+ В ЧЕК"}
                </button>
                <button
                  onClick={() => startEdit(p)}
                  className="p-3 bg-gray-50 text-orange-500 rounded-2xl"
                >
                  ✏️
                </button>
                <button
                  onClick={() => toggleAvailability(p.id, p.isAvailable)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase ${p.isAvailable ? "bg-green-50 text-[#00a693]" : "bg-gray-100 text-gray-400"}`}
                >
                  {p.isAvailable ? "Є в наявності" : "Нема"}
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-3 bg-gray-50 text-red-400 rounded-2xl"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP ЗАМОВЛЕННЯ */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-2xl font-black">Створення замовлення</h2>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1" id="print-area">
              <div className="hidden print:block text-center mb-8">
                <h1 className="text-3xl font-black text-[#00a693]">
                  FreshDoze
                </h1>
                <p className="text-gray-500 uppercase tracking-widest text-xs">
                  Ваше замовлення
                </p>
              </div>

              <div className="space-y-6">
                {orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-start border-b border-dashed pb-4"
                  >
                    <div className="flex-1">
                      <h4 className="font-bold text-lg leading-tight">
                        {item.brand}
                      </h4>
                      <p className="text-gray-600">{item.name}</p>
                      <div className="mt-2 flex items-center gap-3 print:hidden">
                        <label className="text-xs font-bold text-gray-400">
                          ОБ'ЄМ (МЛ):
                        </label>
                        <input
                          type="number"
                          value={item.ml}
                          onChange={(e) =>
                            updateOrderItemMl(item.id, e.target.value)
                          }
                          className="w-20 p-2 bg-gray-100 rounded-lg font-bold outline-none focus:ring-2 focus:ring-[#00a693]"
                        />
                      </div>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="font-black text-lg">{item.totalPrice} ₴</p>
                      <p className="text-xs text-gray-400">
                        {item.ml} мл × {item.pricePerMl}₴
                      </p>
                      <button
                        onClick={() => removeFromOrder(item.id)}
                        className="text-red-400 text-xs mt-2 print:hidden underline"
                      >
                        Видалити
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 bg-gray-900 text-white p-8 rounded-[2rem]">
                <div className="flex justify-between mb-2 opacity-70 text-sm">
                  <span>Кількість флаконів:</span>
                  <span>{orderItems.length} шт.</span>
                </div>
                <div className="flex justify-between mb-4 opacity-70 text-sm">
                  <span>Загальний об'єм:</span>
                  <span>{totalMl} мл</span>
                </div>
                <div className="h-[1px] bg-white/20 mb-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-xl font-bold uppercase tracking-tighter">
                    Підсумок:
                  </span>
                  <span className="text-4xl font-black text-[#00ffcc]">
                    {totalSum} ₴
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex gap-4">
              <button
                onClick={handlePrint}
                className="flex-1 bg-[#00a693] text-white p-4 rounded-2xl font-black shadow-lg hover:shadow-xl transition-all"
              >
                ЗБЕРЕГТИ PDF / ДРУК
              </button>
              <button
                onClick={() => setOrderItems([])}
                className="px-6 bg-gray-200 text-gray-600 rounded-2xl font-bold"
              >
                ОЧИСТИТИ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
