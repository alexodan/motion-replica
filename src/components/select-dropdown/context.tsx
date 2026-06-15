import { createContext, useContext } from "react";

interface ComboboxContextType {
  items: string[];
  selectedValue: string | null;
  onOptionSelected: (value: string) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onLoadMore?: () => void;
  currentFocusValue: string;
  setCurrentFocusValue: (value: string) => void;
}

export const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

export function useComboboxContext() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      "Combobox components must be used within a Combobox provider",
    );
  }
  return context;
}
