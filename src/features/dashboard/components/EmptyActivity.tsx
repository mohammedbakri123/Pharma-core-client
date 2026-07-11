import { Boxes } from "lucide-react";

export function EmptyActivity({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-sm text-muted-foreground">
      <Boxes className="h-4 w-4" />
      {text}
    </div>
  );
}
