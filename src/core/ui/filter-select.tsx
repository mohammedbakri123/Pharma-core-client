import { Filter } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FilterSelectProps {
  filterField: string;
  options: Option[];
  placeholder?: string;
  label?: string;
  className?: string;
}

function FilterSelect({
  filterField,
  options,
  placeholder,
  label,
  className,
}: FilterSelectProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentValue = searchParams.get(filterField) ?? "all";

  function handleChange(value: string) {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(filterField);
    } else {
      params.set(filterField, value);
    }
    params.set("page", "1");
    setSearchParams(params);
  }

  return (
    <fieldset className="space-y-1">
      {label && (
        <label className="text-xs text-muted-foreground block text-right">
          {label}
        </label>
      )}
      <Select value={currentValue} onValueChange={handleChange}>
        <SelectTrigger className={className}>
          <Filter className="h-3.5 w-3.5 ml-2 text-muted-foreground shrink-0" />
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </fieldset>
  );
}

export default FilterSelect;
