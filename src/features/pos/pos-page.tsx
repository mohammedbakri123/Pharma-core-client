import { useState } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Card, CardContent } from "@/ui/card";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import {
  Search,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Banknote,
  User,
  ScanBarcode,
} from "lucide-react";

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

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (product: any) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.15; // 15% VAT
  const total = subtotal + tax;

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6" dir="rtl">
      {/* Left Side: Product Grid */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="البحث عن منتجات..."
              className="pr-10 h-11 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="h-11 w-11 shrink-0">
            <ScanBarcode className="w-5 h-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 pl-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group bg-card"
                onClick={() => addToCart(product)}
              >
                <CardContent className="p-4 flex flex-col items-center text-center h-full justify-between gap-4">
                  <div
                    className={`w-12 h-12 rounded-full ${product.color} flex items-center justify-center font-bold text-lg mb-2 group-hover:scale-110 transition-transform`}
                  >
                    {product.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                  <div className="font-bold text-lg text-primary">
                    {product.price.toFixed(2)} ر.س
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Side: Cart */}
      <div className="w-[400px] bg-card rounded-xl shadow-xl border border-border flex flex-col overflow-hidden">
        <div className="p-4 bg-muted/50 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-heading font-bold text-lg">الطلب الحالي</h3>
            <div className="flex items-center text-sm text-muted-foreground bg-card px-2 py-1 rounded border">
              <User className="w-3 h-3 ml-1" />
              <span>عميل نقدي</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">رقم العملية #TRX-8842</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-2 opacity-50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <CreditCard className="w-8 h-8" />
              </div>
              <p>السلة فارغة</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300 text-right"
              >
                <div className="w-10 h-10 rounded bg-muted flex items-center justify-center font-bold text-muted-foreground text-xs">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {item.price.toFixed(2)} ر.س / للوحدة
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => updateQuantity(item.id, -1)}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="w-4 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 rounded-full"
                    onClick={() => updateQuantity(item.id, 1)}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-left min-w-[80px]">
                  <div className="font-bold text-sm">
                    {(item.price * item.quantity).toFixed(2)} ر.س
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-destructive text-[10px] hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-muted/50 border-t border-border space-y-3">
          <div className="space-y-1 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>المجموع الفرعي</span>
              <span>{subtotal.toFixed(2)} ر.س</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>ضريبة القيمة المضافة (15%)</span>
              <span>{tax.toFixed(2)} ر.س</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg text-foreground">
              <span>الإجمالي</span>
              <span>{total.toFixed(2)} ر.س</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5"
            >
              <CreditCard className="w-4 h-4 ml-2" /> بطاقة
            </Button>
            <Button
              variant="outline"
              className="w-full border-primary/20 text-primary hover:bg-primary/5"
            >
              <Banknote className="w-4 h-4 ml-2" /> نقداً
            </Button>
          </div>
          <Button
            className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20"
            size="lg"
            disabled={cart.length === 0}
          >
            إتمام الدفع
          </Button>
        </div>
      </div>
    </div>
  );
}
