export const formatOrderText = (cart, cartTotal) => {
  let message = "Вітаю! Хочу зробити замовлення:\n\n";
  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.brand} ${item.name} — ${item.volume}мл (${item.price} ₴)\n`;
  });
  message += `\nРазом до сплати: ${cartTotal} ₴`;
  message += `\n\n*Примітка: ціна за стандартні об'єми (3, 5, 10мл) вже включає вартість флакона. Для власного об'єму ціна вказана тільки за парфуми.`;
  return message;
};
