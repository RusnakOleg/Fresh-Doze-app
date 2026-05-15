import { useState, useMemo, useEffect, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

import { usePerfumes } from "../hooks/usePerfumes";
import useOrder from "../hooks/useOrder";

import Header from "../components/Admin/layout/Header";
import PerfumeForm from "../components/Admin/perfume/PerfumeForm";
import FilterBar from "../components/Admin/layout/FilterBar";
import PerfumeList from "../components/Admin/perfume/PerfumeList";
import Pagination from "../components/UI/Pagination";
import OrderModal from "../components/Admin/order/OrderModal";
import PrintInvoice from "../components/Admin/order/PrintInvoice";
import FloatingOrderButton from "../components/Admin/order/FloatingOrderButton";
import { ITEMS_PER_PAGE_ADMIN } from "../utils/constants";
import Loader from "../components/UI/Loader";

export default function AdminPage() {
  const navigate = useNavigate();
  const listTopRef = useRef(null);

  const [user, setUser] = useState(null);

  const {
    perfumes,
    loading,
    addPerfume,
    updatePerfume,
    deletePerfume,
    toggleAvailability,
  } = usePerfumes();

  const {
    orderItems,
    addToOrder,
    updateOrderItemMl,
    updateOrderItemBottle,
    removeFromOrder,
    clearOrder,
    totalSum,
    totalMl,
  } = useOrder();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("men");
  const [notes, setNotes] = useState("");
  const [editId, setEditId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const [displayedPagesCount, setDisplayedPagesCount] = useState(1);

  const itemsPerPage = ITEMS_PER_PAGE_ADMIN;

  const resetFilters = () => {
    setSearchTerm("");
    setFilterCategory("all");
    setFilterBrand("all");
    setSortByPrice("none");
    setCurrentPage(1);
    setDisplayedPagesCount(1);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) navigate("/login");
      else setUser(currentUser);
    });

    return () => unsub();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const perfumeData = {
      name,
      brand,
      description,
      imageUrl,
      category,
      notes,
      pricePerMl: Number(price),
    };

    if (editId) await updatePerfume(editId, perfumeData);
    else await addPerfume(perfumeData);

    resetForm();
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    await deletePerfume(id);
  };

  const filteredPerfumes = useMemo(() => {
    let result = [...perfumes];

    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterCategory !== "all") {
      result = result.filter((p) => p.category === filterCategory);
    }

    if (filterBrand !== "all") {
      result = result.filter((p) => p.brand === filterBrand);
    }

    if (sortByPrice === "low") {
      result.sort((a, b) => a.pricePerMl - b.pricePerMl);
    }

    if (sortByPrice === "high") {
      result.sort((a, b) => b.pricePerMl - a.pricePerMl);
    }

    return result;
  }, [perfumes, searchTerm, filterCategory, filterBrand, sortByPrice]);

  const uniqueBrands = useMemo(() => {
    return ["all", ...new Set(perfumes.map((p) => p.brand))];
  }, [perfumes]);

  useEffect(() => {
    setCurrentPage(1);
    setDisplayedPagesCount(1);
  }, [searchTerm, filterCategory, filterBrand, sortByPrice]);

  const totalPages = Math.ceil(filteredPerfumes.length / itemsPerPage);

  const currentItems = useMemo(() => {
    return filteredPerfumes.slice(
      (currentPage - 1) * itemsPerPage,
      (currentPage - 1) * itemsPerPage + displayedPagesCount * itemsPerPage,
    );
  }, [filteredPerfumes, currentPage, displayedPagesCount]);

  const scrollToItems = () => {
    if (listTopRef.current) {
      listTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    setDisplayedPagesCount(1);
    // Замість window.scrollTo використовуємо нашу функцію:
    setTimeout(scrollToItems, 100);
  };

  const handleNextPage = () => {
    const nextTargetPage = currentPage + displayedPagesCount;
    if (nextTargetPage <= totalPages) {
      setCurrentPage(nextTargetPage);
      setDisplayedPagesCount(1);
      setTimeout(scrollToItems, 100); // Додаємо невелику затримку для плавності
    }
  };

  if (loading) return <Loader />;

  if (!user) return null;

  return (
    <div className=" bg-gray-50 pb-20 font-sans">
      <Header />

      <FloatingOrderButton
        orderItems={orderItems}
        onOpen={() => setIsOrderModalOpen(true)}
      />

      <div className="max-w-5xl mx-auto px-4 mt-8">
        <PerfumeForm
          {...{
            name,
            setName,
            brand,
            setBrand,
            price,
            setPrice,
            description,
            setDescription,
            imageUrl,
            setImageUrl,
            category,
            setCategory,
            notes,
            setNotes,
            editId,
            handleSubmit,
            resetForm,
          }}
        />

        <FilterBar
          {...{
            listTopRef,
            searchTerm,
            setSearchTerm,
            filterCategory,
            setFilterCategory,
            filterBrand,
            setFilterBrand,
            sortByPrice,
            setSortByPrice,
            uniqueBrands,
            resetFilters,
          }}
        />

        <PerfumeList
          {...{
            currentItems,
            orderItems,
            addToOrder,
            startEdit,
            toggleAvailability,
            handleDelete,
          }}
        />

        <Pagination
          {...{
            currentPage,
            totalPages,
            displayedPagesCount,
            handleShowMore: () => setDisplayedPagesCount((p) => p + 1),
            handlePageClick: handlePageClick,
            handleNextPage: handleNextPage,
          }}
        />
      </div>

      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        {...{
          orderItems,
          updateOrderItemMl,
          updateOrderItemBottle,
          removeFromOrder,
          totalSum,
          totalMl,
          clearOrder,
          handlePrint: () => window.print(),
        }}
      />

      <PrintInvoice
        {...{
          orderItems,
          totalSum,
          totalMl,
        }}
      />
    </div>
  );
}
