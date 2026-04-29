import type { PropsWithChildren } from "react";

type ComboboxItem = {
  key: string;
  value: string;
};

export function ComboboxItem({ value }: PropsWithChildren<ComboboxItem>) {
  return <li>{value}</li>;
}
