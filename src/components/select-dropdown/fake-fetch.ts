import { COUNTRIES, USERS } from "../../constants";

const PAGE_SIZE = 10;

export async function fakeFetchCountries(text: string): Promise<string[]> {
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

export async function fakeFetchUsers(
  text: string,
  offset = 0,
): Promise<string[]> {
  return new Promise((res) => {
    setTimeout(() => {
      res(
        USERS.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          .filter((user) => user.toLowerCase().includes(text.toLowerCase()))
          .slice(offset * PAGE_SIZE, offset * PAGE_SIZE + PAGE_SIZE),
      );
    }, 2000);
  });
}
