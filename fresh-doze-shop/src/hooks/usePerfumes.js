import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export const usePerfumes = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  //  ЗАВАНТАЖЕННЯ: Виконується ТІЛЬКИ 1 раз за сесію
  const fetchPerfumes = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "perfumes"));
      const data = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPerfumes(data);
    } catch (error) {
      console.error("Помилка завантаження:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPerfumes();
  }, [fetchPerfumes]);

  //  ДОДАВАННЯ: Пишемо в БД + додаємо в масив вручну
  const addPerfume = async (perfumeData) => {
    const loadingToast = toast.loading("Зберігаю аромат...");
    try {
      const docRef = await addDoc(collection(db, "perfumes"), {
        ...perfumeData,
        isAvailable: true,
      });
      // Оновлюємо стейт локально (0 читань з БД)
      setPerfumes((prev) => [
        { id: docRef.id, ...perfumeData, isAvailable: true },
        ...prev,
      ]);
      toast.success("Аромат успішно додано!", { id: loadingToast });
    } catch (e) {
      toast.error("Помилка при додаванні", { id: loadingToast });
    }
  };

  //  ОНОВЛЕННЯ: Пишемо в БД + міняємо елемент у масиві
  const updatePerfume = async (id, perfumeData) => {
    const loadingToast = toast.loading("Оновлюю дані...");
    try {
      await updateDoc(doc(db, "perfumes", id), perfumeData);
      // Оновлюємо стейт локально (0 читань з БД)
      setPerfumes((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...perfumeData } : p)),
      );
      toast.success("Дані оновлено!", { id: loadingToast });
    } catch (e) {
      toast.error("Помилка оновлення", { id: loadingToast });
    }
  };

  // ВИДАЛЕННЯ: Видаляємо в БД + прибираємо з масиву
  const deletePerfume = async (id) => {
    const result = await Swal.fire({
      title: "Видалити цей аромат?",
      text: "Цю дію неможливо буде скасувати!",
      icon: "warning",
      showCancelButton: true,
      background: "#fff",
      buttonsStyling: false,
      confirmButtonText: "Так, видалити!",
      cancelButtonText: "Скасувати",

      customClass: {
        popup: "rounded-[2.5rem] p-8",
        actions: "mt-6 !flex !flex-row !gap-4 !w-full !justify-center",
        confirmButton:
          "bg-[#00a693] text-white px-6 py-3 rounded-2xl font-black hover:bg-[#008d7d] transition-colors min-w-[120px]",
        cancelButton:
          "bg-[#ef4444] text-white px-6 py-3 rounded-2xl font-black hover:bg-red-600 transition-colors min-w-[120px]",
      },
    });
    if (result.isConfirmed) {
      const loadingToast = toast.loading("Видаляю...");
      try {
        await deleteDoc(doc(db, "perfumes", id));
        // Оновлюємо стейт локально (0 читань з БД)
        setPerfumes((prev) => prev.filter((p) => p.id !== id));
        toast.success("Аромат видалено", { id: loadingToast });
      } catch (e) {
        toast.error("Не вдалося видалити аромат", { id: loadingToast });
      }
    }
  };

  // НАЯВНІСТЬ: Пишемо в БД + міняємо статус у масиві
  const toggleAvailability = async (id, currentStatus) => {
    try {
      await updateDoc(doc(db, "perfumes", id), { isAvailable: !currentStatus });
      // Оновлюємо стейт локально (0 читань з БД)
      setPerfumes((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, isAvailable: !currentStatus } : p,
        ),
      );
      toast.success(
        currentStatus ? "Позначено як відсутній" : "Аромат знову в наявності",
      );
    } catch (e) {
      toast.error("Помилка зміни статусу");
      console.error(e);
    }
  };

  return {
    perfumes,
    loading,
    addPerfume,
    updatePerfume,
    deletePerfume,
    toggleAvailability,
  };
};
