import { IoChevronDown } from "react-icons/io5";
import { useComboboxContext } from "./context";
import { cloneElement, useEffect, useRef, type PropsWithChildren } from "react";

import styles from "./styles.module.css";

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
    currentFocusValue,
    setCurrentFocusValue,
  } = useComboboxContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    setIsOpen(true);
    setCurrentFocusValue("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("value:", e.target.value);
    setSearchValue(e.target.value);
    setIsOpen(true);
    onChange(e.target.value);
  };

  useEffect(() => {
    if (!currentFocusValue) {
      inputRef.current?.focus();
    }
  }, [currentFocusValue]);

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
        className={styles["combobox-input"]}
      />
      <IoChevronDown onClick={handleClick} />
    </div>
  );
}

export function ComboboxContent({ children }: PropsWithChildren) {
  const { isOpen } = useComboboxContext();

  if (!isOpen) {
    return null;
  }

  return <div className={styles["combobox-content"]}>{children}</div>;
}

type ComboboxListProps = {
  ref?: React.Ref<HTMLDivElement>;
  children: (props: {
    item: string;
    index: number;
  }) => React.ReactElement<{ index?: number }>;
};

export function ComboboxList({ children, ...props }: ComboboxListProps) {
  const { filteredItems } = useComboboxContext();

  return (
    <div
      style={{ maxHeight: "200px", overflowY: "auto" }}
      role="listbox"
      aria-orientation="vertical"
      {...props}
    >
      {filteredItems.map((item, index) => {
        return cloneElement(children({ item, index }), { index });
      })}
    </div>
  );
}

interface ComboboxItemProps {
  value: string;
}

export function ComboboxItem({
  value,
  children,
}: PropsWithChildren<ComboboxItemProps>) {
  const {
    filteredItems,
    onOptionSelected,
    setSearchValue,
    currentFocusValue,
    onLoadMore,
  } = useComboboxContext();
  const itemRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    onOptionSelected(value);
    setSearchValue(String(value));
  };

  useEffect(() => {
    if (currentFocusValue === value) {
      itemRef.current?.focus();
    }
  }, [currentFocusValue, value]);

  const isLastItem =
    filteredItems.indexOf(value) === filteredItems.length - 1;

  useEffect(() => {
    if (!isLastItem) return;

    const lastItem = itemRef.current;
    if (!lastItem) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onLoadMore?.();
      }
    });

    observer.observe(lastItem);
    return () => observer.disconnect();
  }, [isLastItem, onLoadMore]);

  return (
    <div
      ref={itemRef}
      role="option"
      aria-selected={currentFocusValue === value}
      onClick={handleClick}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}

export function ComboboxEmpty({ children }: PropsWithChildren) {
  const { filteredItems, searchValue, isLoading } = useComboboxContext();

  // don't flash "no items" while a fetch is still in flight
  if (isLoading || !searchValue || filteredItems.length > 0) {
    return null;
  }

  return <div>{children}</div>;
}
