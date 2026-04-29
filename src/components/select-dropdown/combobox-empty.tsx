import { useContext, type PropsWithChildren } from "react";
import DropdownContext from "./context";

export function ComboboxEmpty({ children }: PropsWithChildren) {
  const { items } = useContext(DropdownContext);

  if (items.length > 0) return null;

  return <li>{children}</li>;
}
