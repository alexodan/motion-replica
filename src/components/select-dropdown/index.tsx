import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import styles from "./styles.module.css";

interface ComboboxContextType {
  items: any[];
  //
  selectedValue: any;
  onOptionSelected: (value: any) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setCurrentFocusIndex: (n: number) => void;
  onLoadMore?: () => void;
}

const ComboboxContext = createContext<ComboboxContextType | undefined>(
  undefined,
);

function useComboboxContext() {
  const context = useContext(ComboboxContext);
  if (!context) {
    throw new Error(
      "Combobox components must be used within a Combobox provider",
    );
  }
  return context;
}

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
  const [currentFocusIndex, setCurrentFocusIndex] = useState(0);
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
        currentFocusIndex,
        setCurrentFocusIndex,
        setCurrentFocusValue,
        onLoadMore,
      }}
    >
      <div
        ref={containerRef}
        id="combobox"
        onKeyDown={(e) => {
          const totalItems = items.length;
          if (e.key === "ArrowDown") {
            console.log("arrow down hit");
            setCurrentFocusIndex((prevIndex) => {
              if (prevIndex === totalItems - 1) {
                return -1;
              }
              return prevIndex + 1;
            });
          } else if (e.key === "ArrowUp") {
            setCurrentFocusIndex((prevIndex) => {
              if (prevIndex < 0) {
                return totalItems - 1;
              }
              return prevIndex - 1;
            });
          } else if (e.key === "Enter") {
            console.log("value:", currentFocusValue);
            onOptionSelected(currentFocusValue);
            setSearchValue(currentFocusValue);
            setCurrentFocusIndex(-1);
          }
        }}
      >
        {children}
      </div>
    </ComboboxContext.Provider>
  );
}

interface ComboboxInputProps {
  placeholder?: string;
  onChange: (text: string) => void;
}

export function ComboboxInput({ onChange, placeholder }: ComboboxInputProps) {
  const {
    isOpen,
    setIsOpen,
    searchValue,
    setSearchValue,
    currentFocusIndex,
    setCurrentFocusIndex,
  } = useComboboxContext();
  const inputRef = useRef<HTMLInputElement>(null);

  // onClick handles visibility of ComboboxContent (popover)
  const handleClick = () => {
    setIsOpen(true);
    setCurrentFocusIndex(-1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setIsOpen(true);
    onChange(e.target.value);
  };

  useEffect(() => {
    if (currentFocusIndex === -1) {
      inputRef.current?.focus();
    }
  }, [currentFocusIndex]);

  const displayValue = searchValue;

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        value={displayValue || ""}
        onChange={handleChange}
        onClick={handleClick}
        placeholder={placeholder}
      />
      <IoChevronDown onClick={handleClick} />
    </div>
  );
}

export function ComboboxContent({ children }: PropsWithChildren) {
  // const {isOpen} = useContext(ComboboxContent)
  const { isOpen } = useComboboxContext();

  if (!isOpen) {
    return null;
  }

  return <div className={styles["combobox-content"]}>{children}</div>;
}

interface ComboboxListProps {
  children: (item: any) => ReactNode;
}

export function ComboboxList({ children, ...props }: ComboboxListProps) {
  const { items, searchValue } = useComboboxContext();

  // filtering based on searchValue
  const filteredItems = searchValue
    ? items.filter((item) =>
        String(item).toLowerCase().includes(searchValue.toLowerCase()),
      )
    : items;

  console.log("[DEBUG] all items", { items, filteredItems });

  return (
    <div
      style={{ maxHeight: "100px", overflowY: "auto" }}
      role="listbox"
      aria-orientation="vertical"
      {...props}
    >
      {filteredItems.map((item, index) => {
        return React.cloneElement(children?.({ item, index }), { index });
      })}
    </div>
  );
}

interface ComboboxItemProps {
  value: any;
  children: ReactNode;
  index: number;
}

export function ComboboxItem({ value, children, index }: ComboboxItemProps) {
  const {
    items,
    onOptionSelected,
    setSearchValue,
    currentFocusIndex,
    setCurrentFocusValue,
    onLoadMore,
  } = useComboboxContext();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onOptionSelected(value);
    setSearchValue(String(value));
  };

  // console.log("currentFocusIndex:", currentFocusIndex);

  useEffect(() => {
    if (index === currentFocusIndex) {
      itemRef.current?.focus();
      setCurrentFocusValue(value);
    }
  }, [currentFocusIndex, index, setCurrentFocusValue, value]);

  /**
   * Infinite scroll idea:
   * Grab the last item in the dropdown list
   * Add a scroll event that detects when that last item appears in the window
   * When that happens trigger a onLoadMore(...)
   */
  const isLastItem = index === items.length - 1;
  useEffect(() => {
    if (!isLastItem) return;

    const lastItem = itemRef.current;
    if (!lastItem) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        console.log("[DEBUG]: index", index);
        onLoadMore?.();
      }
    });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, [isLastItem, onLoadMore, index]);

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={index === currentFocusIndex}
      onClick={handleClick}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export function ComboboxEmpty({ children }: PropsWithChildren) {
  const { items, searchValue } = useComboboxContext();

  const filteredItems = searchValue
    ? items.filter((item) =>
        String(item).toLowerCase().includes(searchValue.toLowerCase()),
      )
    : items;

  if (filteredItems.length > 0) {
    return null;
  }

  return <div>{children}</div>;
}
