import { Combobox, ComboboxContent, ComboboxInput, ComboboxList } from "./";
import { ComboboxEmpty } from "./combobox-empty";
import { ComboboxItem } from "./combobox-item";

const COUNTRIES = [
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

export function MyComboboxBasic() {
  return (
    <Combobox items={COUNTRIES}>
      <ComboboxInput placeholder="Select a country" />
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
