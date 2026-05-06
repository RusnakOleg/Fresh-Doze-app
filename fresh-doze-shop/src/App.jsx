import { useEffect, useState } from "react";
import { db } from "./firebase.js";
import { collection, getDocs } from "firebase/firestore";

function App() {
  const [perfumes, setPerfumes] = useState([]);

  useEffect(() => {
    const fetchPerfumes = async () => {
      const querySnapshot = await getDocs(collection(db, "perfumes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPerfumes(data);
    };

    fetchPerfumes();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Наші аромати:</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {perfumes.map((p) => (
          <div key={p.id} className="p-4 border rounded-xl shadow-sm bg-white">
            <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
            <p className="text-gray-500">{p.brand}</p>
            <p className="mt-2 font-bold text-blue-600">
              {p.pricePerMl} грн/мл
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
