import {
  useContext,
  useState,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import DropdownContext, { ContextProvider } from "./context";

import styles from "./styles.module.css";

export function Combobox({
  children,
  items,
}: PropsWithChildren<{ items: string[] }>) {
  // event listener to close combobox when click outside
  return <ContextProvider initialItems={items}>{children}</ContextProvider>;
}

type ComboboxInputProps = React.ComponentProps<"input">;

export function ComboboxInput(props: PropsWithChildren<ComboboxInputProps>) {
  const { setIsPopoverOpen } = useContext(DropdownContext);
  const [value, setValue] = useState("");

  const handleClick = () => {
    setIsPopoverOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e);
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      console.log("Escape key pressed");
    }
  };

  return (
    <div>
      <input
        className={styles.input}
        value={value}
        placeholder={props.placeholder ?? "Choose an item"}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <div className="chevron" onClick={handleClick}></div>
    </div>
  );
}

export function ComboboxContent({ children }: PropsWithChildren) {
  // const {isOpen} = useContext(ComboboxContent)
  return <div>{children}</div>;
}

type ComboboxListProps = {
  children: (item: string) => ReactNode;
};

export function ComboboxList({ children }: ComboboxListProps) {
  const { items, searchValue } = useContext(DropdownContext);

  if (typeof children !== "function") {
    throw Error("children gotta be a function");
  }

  return <>{items.map((item) => children(item))}</>;
}
