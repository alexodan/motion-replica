/**
 * Using ComboboxContext
 * - items (options)
 * - selectedValue
 * - onOptionSelected
 * - searchValue
 * - isOpen
 * - setIsOpen
 */

import { createContext, useState, type PropsWithChildren } from "react";

type DropdownContextType = {
  items: string[];
  isPopoverOpen: boolean;
  setIsPopoverOpen: (isOpen: boolean) => void;
};

const DropdownContext = createContext<DropdownContextType>({
  items: [],
  isPopoverOpen: false,
  setIsPopoverOpen: () => {},
});

export function ContextProvider({
  initialItems,
  children,
}: PropsWithChildren<{ initialItems: any[] }>) {
  // is not clear why/when would i use setItems
  const [items, setItems] = useState(initialItems);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <DropdownContext.Provider
      value={{
        items,
        isPopoverOpen,
        setIsPopoverOpen,
      }}
    >
      {children}
    </DropdownContext.Provider>
  );
}

export default DropdownContext;
