import { CartItem, Tables } from "@/types";
import { PropsWithChildren, createContext, useContext } from "react";
import { useState } from "react";
import { randomUUID } from "expo-crypto";
import { useInsertOrder } from "@/api/orders";
import { router } from "expo-router";
import { useInsertOrderItems } from "@/api/order-items";

type Product = Tables<"products">;

type CartType = {
  items: CartItem[];
  addItem: (product: Product, size: CartItem["size"]) => void;
  updateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  checkout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  addItem: () => {},
  updateQuantity: () => {},
  total: 0,
  checkout: () => {},
});

const CartProvider = ({ children }: PropsWithChildren) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const addItem = (product: Product, size: CartItem["size"]) => {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
      return;
    }

    const newItem: CartItem = {
      id: randomUUID(),
      product,
      product_id: product.id,
      size,
      quantity: 1,
    };

    setItems((prevItems) => [newItem, ...prevItems]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const updateQuantity = (itemId: string, amount: -1 | 1) => {
    const updatedItems = items
      .map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity: item.quantity + amount };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    setItems(updatedItems);
  };

  const clearCart = () => {
    setItems([]);
  };

  const saveOrderItems = (order: Tables<"orders">) => {
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      size: item.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearCart();
        router.push(`/(user)/orders/${order.id}`);
      },
    });
  };

  const checkout = () => {
    insertOrder(
      {
        total,
      },
      {
        onSuccess: saveOrderItems,
      }
    );
  };

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQuantity, total, checkout }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;

export const useCart = () => {
  return useContext(CartContext);
};
