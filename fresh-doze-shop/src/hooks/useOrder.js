import { useState, useMemo } from "react";

export default function useOrder() {
  const [orderItems, setOrderItems] = useState([]);

  const addToOrder = (perfume) => {
    if (orderItems.find((item) => item.id === perfume.id)) return;

    const defaultMl = 3;
    const defaultBottlePrice = 25;

    setOrderItems([
      ...orderItems,
      {
        ...perfume,
        ml: defaultMl,
        bottlePrice: defaultBottlePrice,
        totalPrice: perfume.pricePerMl * defaultMl + defaultBottlePrice,
      },
    ]);
  };

  const updateOrderItemMl = (id, ml) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newMl = Number(ml);

          return {
            ...item,
            ml: newMl,
            totalPrice: item.pricePerMl * newMl + (item.bottlePrice || 0),
          };
        }

        return item;
      }),
    );
  };

  const updateOrderItemBottle = (id, bottlePrice) => {
    setOrderItems(
      orderItems.map((item) => {
        if (item.id === id) {
          const newBottlePrice = Number(bottlePrice);

          return {
            ...item,
            bottlePrice: newBottlePrice,
            totalPrice: item.pricePerMl * item.ml + newBottlePrice,
          };
        }

        return item;
      }),
    );
  };

  const removeFromOrder = (id) => {
    setOrderItems(orderItems.filter((item) => item.id !== id));
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const totalSum = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.totalPrice, 0);
  }, [orderItems]);

  const totalMl = useMemo(() => {
    return orderItems.reduce((acc, item) => acc + item.ml, 0);
  }, [orderItems]);

  return {
    orderItems,
    addToOrder,
    updateOrderItemMl,
    updateOrderItemBottle,
    removeFromOrder,
    clearOrder,
    totalSum,
    totalMl,
  };
}
