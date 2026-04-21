import {
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
}: PropsWithChildren<{ items: any[] }>) {
  const [selectedValue, setSelectedValue] = useState<any>(null);
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const onOptionSelected = (value: any) => {
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
      }}
    >
      <div ref={containerRef} id="combobox">
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
  const { setIsOpen, searchValue, setSearchValue } = useComboboxContext();

  // onClick handles visibility of ComboboxContent (popover)
  const handleClick = () => {
    setIsOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setIsOpen(true); // todo:
    onChange(e.target.value);
  };

  const displayValue = searchValue;

  return (
    <div>
      <input
        type="text"
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

export function ComboboxList({ children }: ComboboxListProps) {
  const { items, searchValue } = useComboboxContext();

  // filtering based on searchValue
  const filteredItems = searchValue
    ? items.filter((item) =>
        String(item).toLowerCase().includes(searchValue.toLowerCase()),
      )
    : items;

  return <>{filteredItems.map((item) => children(item))}</>;
}

interface ComboboxItemProps {
  value: any;
  children: ReactNode;
}

export function ComboboxItem({ value, children }: ComboboxItemProps) {
  const { onOptionSelected, setSearchValue } = useComboboxContext();

  const handleClick = () => {
    onOptionSelected(value);
    setSearchValue(String(value));
  };

  return <div onClick={handleClick}>{children}</div>;
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
