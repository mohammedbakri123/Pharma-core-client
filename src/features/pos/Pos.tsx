import { useState } from "react";
import POSSearch from "./components/POSSearch";
import ProductGrid from "./components/ProductGrid";
import Cart from "./components/Cart";

const products = [
  {
    id: 1,
    name: "أموكسيسيلين 500 ملغ",
    price: 12.5,
    category: "مضادات حيوية",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
  },
  {
    id: 2,
    name: "ايبوبروفين 400 ملغ",
    price: 8.99,
    category: "مسكنات آلام",
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    id: 3,
    name: "باراسيتامول 500 ملغ",
    price: 5.0,
    category: "مسكنات آلام",
    color: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  },
  {
    id: 4,
    name: "فيتامين سي 1000 ملغ",
    price: 15.0,
    category: "مكملات غذائية",
    color:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
  },
  {
    id: 5,
    name: "ضمادات (عبوة)",
    price: 4.5,
    category: "إسعافات أولية",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
  {
    id: 6,
    name: "شراب للسعال",
    price: 12.0,
    category: "البرد والإنفلونزا",
    color:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  },
  {
    id: 7,
    name: "كريم مطهر",
    price: 7.25,
    category: "إسعافات أولية",
    color:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
  },
  {
    id: 8,
    name: "ميزان حرارة",
    price: 25.0,
    category: "أجهزة طبية",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
  {
    id: 9,
    name: "كمامات (10 قطع)",
    price: 3.5,
    category: "وقاية",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  },
];

export default function POS() {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product: any) => {
    setCart((prev: any) => {
      const existing = prev.find((i: any) => i.id === product.id);
      if (existing) {
        return prev.map((i: any) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev: any) =>
      prev
        .map((item: any) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item: any) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev: any) => prev.filter((i: any) => i.id !== id));
  };

  const subtotal = cart.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6" dir="rtl">
      <div className="flex-1 flex flex-col gap-4">
        <POSSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <ProductGrid products={filteredProducts} addToCart={addToCart} />
      </div>

      <Cart
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        subtotal={subtotal}
        tax={tax}
        total={total}
      />
    </div>
  );
}
