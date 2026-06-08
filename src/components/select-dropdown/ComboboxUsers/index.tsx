import React, { useCallback, useEffect, useState } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../";
import { fakeFetchUsers } from "../fake-fetch";

export function ComboboxUsersBasic() {
  const [users, setUsers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [inputOffset, setInputOffset] = useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (input) {
      fakeFetchUsers(input, inputOffset).then((results) => {
        setUsers((prev) => [...prev, ...results]);
      });
    }
  }, [input, inputOffset]);

  /**
   * TODO
   * what if i want to control where the dropdown content renders, depending on the available space?
   */

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
