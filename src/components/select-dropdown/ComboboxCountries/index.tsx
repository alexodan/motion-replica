import { useEffect, useState } from "react";
import { COUNTRIES } from "../../../constants";
import { fakeFetchCountries } from "../fake-fetch";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "..";

export function ComboboxCountriesBasic() {
  const [countries, setCountries] = useState(COUNTRIES);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (input) {
      fakeFetchCountries(input).then((results) => {
        setCountries(results);
      });
    }
  }, [input]);

  return (
    <>
      <h1>Countries</h1>
      <Combobox items={countries}>
        <ComboboxInput
          onChange={(text: string) => {
            setInput(text);
            // setTimeout not here => lost reference
          }}
          placeholder="Select a country"
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {({ item }) => (
              // value to store in context also
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <hr />
    </>
  );
}
