import { Plus, Minus } from "lucide-react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";

interface QuantityAdjusterProps {
  value: string;
  onChange: (value: string) => void;
  min?: number;
  max: number;
}

export default function QuantityAdjuster({
  value,
  onChange,
  min = 1,
  max,
}: QuantityAdjusterProps) {
  const handleIncrement = () => {
    const current = Number(value);
    if (current < max) {
      onChange((current + 1).toString());
    }
  };

  const handleDecrement = () => {
    const current = Number(value);
    if (current > min) {
      onChange((current - 1).toString());
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="returnedQuantity" className="text-sm font-medium">
        الكمية المرتجعة
      </Label>
      <div className="flex items-center justify-center gap-3 dir-ltr bg-muted/20 border border-border/40 p-4 rounded-xl">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 cursor-pointer hover:bg-muted"
          onClick={handleIncrement}
          disabled={Number(value) >= max}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Input
          id="returnedQuantity"
          type="number"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 text-center font-bold text-base w-24 bg-background"
          required
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 cursor-pointer hover:bg-muted"
          onClick={handleDecrement}
          disabled={Number(value) <= min}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
