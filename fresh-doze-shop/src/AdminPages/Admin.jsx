import { useState, useEffect } from "react";
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
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  //  Перевірка чи ти залогінений
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login"); // Якщо не адмін — виганяємо на логін
      } else {
        setUser(currentUser);
        fetchPerfumes();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  //  Отримання списку парфумів
  const fetchPerfumes = async () => {
    const querySnapshot = await getDocs(collection(db, "perfumes"));
    setPerfumes(querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  //  Додавання нового парфуму
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !brand || !price) return alert("Заповни всі поля");

    await addDoc(collection(db, "perfumes"), {
      name,
      brand,
      pricePerMl: Number(price),
    });

    setName("");
    setBrand("");
    setPrice("");
    fetchPerfumes(); // Оновлюємо список
  };

  //  Видалення
  const handleDelete = async (id) => {
    if (window.confirm("Видалити цей аромат?")) {
      await deleteDoc(doc(db, "perfumes", id));
      fetchPerfumes();
    }
  };

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Панель Адміна</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-red-500 underline"
        >
          Вийти
        </button>
      </div>

      {/* Форма додавання */}
      <form
        onSubmit={handleAdd}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12 bg-gray-50 p-6 rounded-xl border"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Назва аромату"
          className="p-2 border rounded"
        />
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="Бренд"
          className="p-2 border rounded"
        />
        <input
          value={price}
          type="number"
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Ціна за мл"
          className="p-2 border rounded"
        />
        <button className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700">
          Додати
        </button>
      </form>

      {/* Список для редагування/видалення */}
      <div className="space-y-4">
        {perfumes.map((p) => (
          <div
            key={p.id}
            className="flex justify-between items-center p-4 border rounded-lg shadow-sm"
          >
            <div>
              <span className="font-bold">{p.brand}</span> — {p.name} (
              {p.pricePerMl} грн/мл)
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>

      <button onClick={() => navigate("/")} className="mt-8 text-blue-600">
        ← На головну
      </button>
    </div>
  );
}
