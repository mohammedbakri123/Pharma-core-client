export default function PurchaseReturnNote({ note }: { note: string }) {
  return (
    <div className="p-4 rounded-lg bg-muted/40 border border-border/40 text-sm">
      <span className="font-semibold block mb-1">ملاحظة/سبب الإرجاع:</span>
      <span className="text-muted-foreground">{note}</span>
    </div>
  );
}
