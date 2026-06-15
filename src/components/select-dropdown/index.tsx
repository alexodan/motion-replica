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
}: PropsWithChildren<{ items: string[]; onLoadMore?: () => void }>) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentFocusValue, setCurrentFocusValue] = useState<string>("");

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
              const index = items.indexOf(prev);
              if (index === items.length - 1) return "";
              return items[index + 1];
            });
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setCurrentFocusValue((prev) => {
              const index = items.indexOf(prev);
              if (index === 0) {
                return "";
              }
              return items[index - 1];
            });
          } else if (e.key === "Enter") {
            e.preventDefault();
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
