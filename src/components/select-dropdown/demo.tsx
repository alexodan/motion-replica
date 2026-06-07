// https://countriesnow.space/api/v0.1/countries/positions
// https://countriesnow.space/api/v0.1/countries/cities/q?country=Armenia

import React, { useCallback, useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "./";
import { COUNTRIES } from "../../constants";
import { fakeFetchCountries, fakeFetchUsers } from "./fake-fetch";

export function ComboboxDemo() {
  return (
    <>
      <ComboboxCountriesBasic />
      <ComboboxUsersBasic />
    </>
  );
}

// ideas
// [x] keyboard navigation
// [x] a11y is broken
// [-] lazy loading (more users)

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
          placeholder="Select a framework"
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
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

export function ComboboxUsersBasic() {
  const [users, setUsers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [inputOffset, setInputOffset] = useState(0);
  const listRef = React.createRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input) {
      console.log("[debug2]: inputOffset: ", inputOffset);
      fakeFetchUsers(input, inputOffset).then((results) => {
        console.log("[DEBUG]: fetching...", results, inputOffset);
        setUsers((prev) => [...prev, ...results]);
      });
    }
  }, [input, inputOffset]);

  /**
   * TODO
   * what if i want to control where the dropdown content renders, depending on the available space?
   */
  console.log("[debug2] users:", users);

  const handleLoadMore = useCallback(() => {
    console.log("[DEBUG]: loading more...");
    setInputOffset((prev) => prev + 1);
  }, []);

  return (
    <>
      <h1>Users</h1>
      <Combobox items={users} onLoadMore={handleLoadMore}>
        <ComboboxInput
          onChange={(text: string) => {
            setInput(text);
            // setTimeout not here => lost reference
          }}
          placeholder="Select a framework"
        />
        <ComboboxContent>
          <ComboboxEmpty>No items found.</ComboboxEmpty>
          <ComboboxList ref={listRef}>
            {({ item, index }) => (
              // value to store in context also
              <ComboboxItem key={`${item}-${index}`} value={item}>
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
