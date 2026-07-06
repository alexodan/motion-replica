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
  const [isLoading, setIsLoading] = useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // guards against an earlier slow fetch resolving after a newer one and
    // overwriting fresh results (the fake fetch has a 2s delay)
    let cancelled = false;
    setIsLoading(true);

    fakeFetchUsers(input, inputOffset).then((results) => {
      if (cancelled) return;
      setUsers((prev) => {
        // offset 0 means a new search → replace; later pages append
        if (inputOffset === 0) return results;
        const all = new Set(prev);
        results.forEach((r) => all.add(r));
        return Array.from(all);
      });
      setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [input, inputOffset]);

  const handleLoadMore = useCallback(() => {
    console.log("[DEBUG]: loading more...");
    setInputOffset((prev) => prev + 1);
  }, []);

  console.log("users:", users.length);

  return (
    <>
      <h1>Users</h1>
      <Combobox items={users} onLoadMore={handleLoadMore} isLoading={isLoading}>
        <ComboboxInput
          onChange={(text: string) => {
            setInput(text);
            // new query → restart pagination so we don't skip pages
            setInputOffset(0);
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
