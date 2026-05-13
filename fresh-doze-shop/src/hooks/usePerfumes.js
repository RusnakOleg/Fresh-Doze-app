import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export const usePerfumes = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerfumes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "perfumes"));
        setPerfumes(
          querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      } catch (error) {
        console.error("Error fetching perfumes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPerfumes();
  }, []);

  return { perfumes, loading };
};
