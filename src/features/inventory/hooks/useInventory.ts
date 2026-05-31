import { useState } from "react";

export function useInventory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  return {
    isLoading,
    error,
    setIsLoading,
    setError,
    clearError,
  };
}
