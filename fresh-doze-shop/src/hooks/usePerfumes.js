import { useState, useEffect, useCallback } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export const usePerfumes = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Використовуємо useCallback, щоб функцію можна було стабільно передавати в useEffect
  const fetchPerfumes = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "perfumes"));
      const data = querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setPerfumes(data);
    } catch (error) {
      console.error("Error fetching perfumes:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Автоматично завантажуємо дані при першому рендері
  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  // --- Адмін-методи ---

  const addPerfume = async (perfumeData) => {
    try {
      await addDoc(collection(db, "perfumes"), {
        ...perfumeData,
        isAvailable: true,
      });
      await fetchPerfumes(); // Оновлюємо список
    } catch (e) {
      alert("Помилка при додаванні");
    }
  };

  const updatePerfume = async (id, perfumeData) => {
    try {
      await updateDoc(doc(db, "perfumes", id), perfumeData);
      await fetchPerfumes();
    } catch (e) {
      alert("Помилка при оновленні");
    }
  };

  const deletePerfume = async (id) => {
    if (window.confirm("Видалити цей аромат?")) {
      try {
        await deleteDoc(doc(db, "perfumes", id));
        await fetchPerfumes();
      } catch (e) {
        alert("Помилка при видаленні");
      }
    }
  };

  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "perfumes", id), {
        isAvailable: !currentStatus,
      });
      await fetchPerfumes();
    } catch (e) {
      console.error(e);
    }
  };

  return {
    perfumes,
    loading,
    fetchPerfumes,
    addPerfume,
    updatePerfume,
    deletePerfume,
    toggleAvailability,
  };
};
