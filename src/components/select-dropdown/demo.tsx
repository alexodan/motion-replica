// https://countriesnow.space/api/v0.1/countries/positions
// https://countriesnow.space/api/v0.1/countries/cities/q?country=Armenia

const countries = [
  "Albania",
  "Botswana",
  "Bulgaria",
  "Cameroon",
  "Canada",
  "France",
  "Guatemala",
  "Honduras",
  "Hong Kong",
  "Iceland",
  "India",
];

// export function SelectDropdownDemo() {
//   return (
//     <Select.Dropdown defaultValue={countries[0]}>
//       {countries.map((c) => (
//         <Select.Option key={c} value={c}>
//           {c}
//         </Select.Option>
//       ))}
//     </Select.Dropdown>
//   );
// }

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./";

export function ComboboxBasic() {
  return (
    <Combobox items={countries}>
      <ComboboxInput placeholder="Select a framework" />
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
