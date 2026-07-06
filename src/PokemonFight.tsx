import { useEffect, useState } from "react";

const url =
  "https://gist.githubusercontent.com/balazspete/b3d94c8b4615883e1ecc1db5f4a68637/raw/4138c49a55d9a0698c953ea12477b3edec8fa2bf/gistfile1.txt";

type PokemonStats = {
  name: string;
  height: number;
  id: number;
  base_experience: number;
};

export function PokemonFight() {
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [pokemonList, setPokemonList] = useState<PokemonStats[]>([]);

  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then(setPokemonList);
  }, []);

  console.log(pokemonList);

  return (
    <div>
      <h1>Pokemon Fightclub</h1>
      <p>Selected 1: {pokemon1}</p>
      <p>Selected 2: {pokemon2}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <SearchList
          items={pokemonList}
          selected={pokemon1}
          onSelect={(p) => setPokemon1(p)}
        />
        <SearchList
          items={pokemonList}
          selected={pokemon2}
          onSelect={(p) => setPokemon2(p)}
        />
      </div>
    </div>
  );
}

type SearchListProps = {
  selected: string;
  items: PokemonStats[];
  onSelect: (name: string) => void;
};

export function SearchList({ selected, items, onSelect }: SearchListProps) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  return (
    <div>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search pokemon by name"
      />
      <select
        value={sortBy}
        onChange={(e) => {
          setSortBy(e.target.value);
        }}
      >
        <option value="xp">XP</option>
        <option value="name">Name</option>
      </select>
      <ul
        style={{
          height: "300px",
          overflow: "auto",
        }}
      >
        {items
          .filter((item) => item.name.includes(search))
          .sort((a, b) => {
            if (sortBy === "xp") {
              return a.base_experience - b.base_experience;
            }
            return a.name.localeCompare(b.name);
          })
          .map((item) => (
            <li
              key={item.id}
              style={{ backgroundColor: item.name === selected ? "black" : "" }}
            >
              <button onClick={() => onSelect(item.name)}>
                {item.name} ({item.base_experience})
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
