import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "./use-debounce";

export function useDebouncedSearchParams(delay = 500) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(search);
  const debouncedInput = useDebounce(searchInput, delay);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedInput.trim()) {
      params.set("search", debouncedInput);
      params.set("page", "1");
    } else {
      params.delete("search");
    }

    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  }, [debouncedInput, searchParams, setSearchParams]);

  return { searchInput, setSearchInput };
}
