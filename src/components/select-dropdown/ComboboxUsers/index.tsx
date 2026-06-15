import React, { useCallback, useEffect, useState } from "react";
import { Combobox } from "../";
import {
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../parts";
import { fakeFetchUsers } from "../fake-fetch";

export function ComboboxUsersBasic() {
  const [users, setUsers] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [inputOffset, setInputOffset] = useState(0);
  const listRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    fakeFetchUsers(input, inputOffset).then((results) => {
      console.log("calling fetch users...");
      setUsers((prev) => {
        const all = new Set(prev);
        results.forEach((r) => all.add(r));
        return Array.from(all);
      });
    });
  }, [input, inputOffset]);

  const handleLoadMore = useCallback(() => {
    console.log("[DEBUG]: loading more...");
    setInputOffset((prev) => prev + 1);
  }, []);

  console.log("users:", users.length);

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
