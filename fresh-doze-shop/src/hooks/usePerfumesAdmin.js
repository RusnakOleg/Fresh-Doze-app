import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function usePerfumesAdmin() {
  const [perfumes, setPerfumes] = useState([]);

  const fetchPerfumes = async () => {
    const querySnapshot = await getDocs(collection(db, "perfumes"));

    setPerfumes(
      querySnapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })),
    );
  };

  useEffect(() => {
    fetchPerfumes();
  }, []);

  const addPerfume = async (perfumeData) => {
    await addDoc(collection(db, "perfumes"), {
      ...perfumeData,
      isAvailable: true,
    });

    fetchPerfumes();
  };

  const updatePerfume = async (id, perfumeData) => {
    await updateDoc(doc(db, "perfumes", id), perfumeData);
    fetchPerfumes();
  };

  const deletePerfume = async (id) => {
    await deleteDoc(doc(db, "perfumes", id));
    fetchPerfumes();
  };

  const toggleAvailability = async (id, currentStatus) => {
    await updateDoc(doc(db, "perfumes", id), {
      isAvailable: !currentStatus,
    });

    fetchPerfumes();
  };

  return {
    perfumes,
    fetchPerfumes,
    addPerfume,
    updatePerfume,
    deletePerfume,
    toggleAvailability,
  };
}
