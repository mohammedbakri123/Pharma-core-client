import { cn } from "@/utils/utils";
import { useSearchParams } from "react-router-dom";

interface Option {
  value: string;
  label: string;
}

interface FilterProps {
  filterField: string;
  options: Option[];
  className?: string;
}

function Filter({ filterField, options, className }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get(filterField) || options.at(0)?.value;

  function handleClick(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set(filterField, value);
    if (params.get("page")) params.set("page", "1");
    setSearchParams(params);
  }

  return (
    <div
      className={cn(
        "border rounded-md shadow-sm bg-background p-1 flex gap-1",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          disabled={option.value === currentFilter}
          className={cn(
            "rounded-sm font-medium text-sm px-2.5 py-0.75 transition-colors border border-transparent",
            option.value === currentFilter
              ? "bg-primary text-primary-foreground pointer-events-none"
              : "bg-background hover:bg-primary hover:text-primary-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default Filter;
