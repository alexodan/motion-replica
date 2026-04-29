// https://countriesnow.space/api/v0.1/countries/positions
// https://countriesnow.space/api/v0.1/countries/cities/q?country=Armenia

import { MyComboboxBasic } from "./my-combobox";
import { ShadcnComboboxBasic } from "./shadcn-combobox";

export function SelectDropdownDemo() {
  return (
    <>
      <h2>Shadcn Combobox</h2>
      <ShadcnComboboxBasic />
      <h2>My Combobox</h2>
      <MyComboboxBasic />
    </>
  );
}
