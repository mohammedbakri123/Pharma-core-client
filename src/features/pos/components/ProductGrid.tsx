import { ScrollArea } from "@/ui/scroll-area";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, addToCart }: any) {
  return (
    <ScrollArea className="flex-1 pl-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-4">
        {products.map((product: any) => (
          <ProductCard key={product.id} product={product} onClick={addToCart} />
        ))}
      </div>
    </ScrollArea>
  );
}
