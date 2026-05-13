import { useState, useMemo, useEffect } from "react";
import Header from "./components/layout/Header";
import PerfumeGrid from "./components/perfume/PerfumeGrid";
import PerfumeModal from "./components/perfume/PerfumeModal";
import CartModal from "./components/cart/CartModal";
import OrderModal from "./components/cart/OrderModal";
import Pagination from "./components/UI/Pagination";
import { usePerfumes } from "./hooks/usePerfumes";
import { formatOrderText } from "./utils/helpers";
import {
  ITEMS_PER_PAGE,
  TELEGRAM_CHANNEL_LINK,
  TELEGRAM_ORDER_LINK,
} from "./utils/constants";

function App() {
  const { perfumes, loading } = usePerfumes();
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedPagesCount, setDisplayedPagesCount] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterBrand, setFilterBrand] = useState("all");
  const [sortByPrice, setSortByPrice] = useState("none");

  const [selectedPerfume, setSelectedPerfume] = useState(null);
  const [orderText, setOrderText] = useState("");

  const uniqueBrands = useMemo(
    () => ["all", ...new Set(perfumes.map((p) => p.brand))],
    [perfumes],
  );

  useEffect(() => {
    setCurrentPage(1);
    setDisplayedPagesCount(1);
  }, [searchTerm, filterCategory, filterBrand, sortByPrice]);

  const filteredItems = useMemo(() => {
    let result = perfumes.filter((p) => p.isAvailable !== false);
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

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    (currentPage - 1) * ITEMS_PER_PAGE + displayedPagesCount * ITEMS_PER_PAGE,
  );

  const addToCart = (perfume, volume) => {
    if (!volume || volume <= 0) return;
    const newItem = {
      cartId: Date.now(),
      id: perfume.id,
      brand: perfume.brand,
      name: perfume.name,
      volume: Number(volume),
      price: Math.round(volume * perfume.pricePerMl),
    };
    setCart([...cart, newItem]);
    setSelectedPerfume(null);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-[#00a693]">
        Завантаження FRESH DOZE...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-10 text-gray-900 font-sans">
      <Header
        cartCount={cart.length}
        setIsCartOpen={setIsCartOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterBrand={filterBrand}
        setFilterBrand={setFilterBrand}
        sortByPrice={sortByPrice}
        setSortByPrice={setSortByPrice}
        uniqueBrands={uniqueBrands}
        resetFilters={() => {
          setSearchTerm("");
          setFilterCategory("all");
          setFilterBrand("all");
          setSortByPrice("none");
        }}
        telegramChannelLink={TELEGRAM_CHANNEL_LINK}
      />

      <main className="max-w-6xl mx-auto px-4 mt-6">
        <PerfumeGrid items={currentItems} onPerfumeClick={setSelectedPerfume} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          displayedPagesCount={displayedPagesCount}
          handleShowMore={() => setDisplayedPagesCount((prev) => prev + 1)}
          handlePageClick={(n) => {
            setCurrentPage(n);
            setDisplayedPagesCount(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          handleNextPage={() => {
            setCurrentPage(currentPage + displayedPagesCount);
            setDisplayedPagesCount(1);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </main>

      {selectedPerfume && (
        <PerfumeModal
          perfume={selectedPerfume}
          onClose={() => setSelectedPerfume(null)}
          addToCart={addToCart}
        />
      )}
      {isCartOpen && (
        <CartModal
          cart={cart}
          cartTotal={cartTotal}
          removeFromCart={(id) => setCart(cart.filter((i) => i.cartId !== id))}
          onClose={() => setIsCartOpen(false)}
          onGenerateText={() => setOrderText(formatOrderText(cart, cartTotal))}
        />
      )}
      {orderText && (
        <OrderModal
          telegramOrderLink={TELEGRAM_ORDER_LINK}
          text={orderText}
          onClose={() => setOrderText("")}
        />
      )}
    </div>
  );
}

export default App;
