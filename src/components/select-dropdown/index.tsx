import { useEffect, useRef, useState, type PropsWithChildren } from "react";

import { ComboboxContext } from "./context";

import styles from "./styles.module.css";

/**
 * Using ComboboxContext
 * - items (options)
 * - selectedValue
 * - onOptionSelected
 * - searchValue
 * - isOpen
 * - setIsOpen
 */
export function Combobox({
  items,
  children,
  onLoadMore,
  isLoading,
}: PropsWithChildren<{
  items: string[];
  onLoadMore?: () => void;
  isLoading?: boolean;
}>) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFocusValue, setCurrentFocusValue] = useState<string>("");

  // Single source of truth for what's actually visible. Keyboard nav, the
  // load-more sentinel and the empty state all derive from this so they can
  // never drift from what's rendered.
  const filteredItems = searchValue
    ? items.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase()),
      )
    : items;

  // event listener to close combobox when click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onOptionSelected = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
  };

  return (
    <ComboboxContext.Provider
      value={{
        items,
        filteredItems,
        isLoading,
        selectedValue,
        onOptionSelected,
        searchValue,
        setSearchValue,
        isOpen,
        setIsOpen,
        currentFocusValue,
        setCurrentFocusValue,
        onLoadMore,
      }}
    >
      <div
        ref={containerRef}
        id="combobox"
        className={styles.combobox}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setCurrentFocusValue((prev) => {
              const index = filteredItems.indexOf(prev);
              // last item (or empty list) wraps back to the input
              if (index === filteredItems.length - 1) return "";
              return filteredItems[index + 1];
            });
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCurrentFocusValue((prev) => {
              const index = filteredItems.indexOf(prev);
              // at the first item, or on the input (indexOf === -1) → input
              if (index <= 0) return "";
              return filteredItems[index - 1];
            });
          } else if (e.key === "Enter") {
            e.preventDefault();
            // nothing highlighted (focus is on the input) → don't select ""
            if (!currentFocusValue) return;
            onOptionSelected(currentFocusValue);
            setSearchValue(currentFocusValue);
            setCurrentFocusValue("");
          } else if (e.key === "Escape") {
            e.preventDefault();
            setCurrentFocusValue("");
            setIsOpen(false);
          }
        }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}
