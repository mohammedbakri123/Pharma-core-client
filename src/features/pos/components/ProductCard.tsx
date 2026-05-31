import { Card, CardContent } from "@/ui/card";

export default function ProductCard({ product, onClick }: any) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg hover:border-primary/50 transition-all duration-200 group bg-card"
      onClick={() => onClick(product)}
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
          <p className="text-xs text-muted-foreground">{product.category}</p>
        </div>

        <div className="font-bold text-lg text-primary">
          {product.price.toFixed(2)} ر.س
        </div>
      </CardContent>
    </Card>
  );
}
