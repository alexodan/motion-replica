// https://countriesnow.space/api/v0.1/countries/positions
// https://countriesnow.space/api/v0.1/countries/cities/q?country=Armenia

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

import { useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./";

async function fakeFetch(text: string) {
  return new Promise((res) => {
    setTimeout(() => {
      res(
        ["Argentina", "Argelia", "Armenia", ...COUNTRIES].filter((c) =>
          c.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    }, 2000);
  });
}

export function ComboboxDemo() {
  return (
    <>
      <ComboboxBasic />
      <ComboboxBasic />
    </>
  );
}

// ideas
// lazy loading (more users)
// keyboard navigation

export function ComboboxBasic() {
  const [countries, setCountries] = useState(COUNTRIES);
  const [input, setInput] = useState("");
  // useDebounce(...) // todo: hw (+loading)

  useEffect(() => {
    if (input) {
      fakeFetch(input).then((results) => {
        setCountries(results);
      });
    }
  }, [input]);

  return (
    <Combobox items={countries}>
      <ComboboxInput
        onChange={(text: string) => {
          setInput(text);
          // setTimeout not here => lost reference
        }}
        placeholder="Select a framework"
      />
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
