"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function page() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [visiblePokemon, setVisiblePokemon] = useState([]);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const router = useRouter();

  useEffect(() => {
    async function fetchAllPokemon() {
      const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`
      );
      const data = await res.json();
      setAllPokemon(data.results);
      setCount(data.results.length);
    }
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    const paginated = allPokemon.slice(offset, offset + limit);
    setVisiblePokemon(paginated);
  }, [offset, allPokemon]);

  const getImage = (pokemon) => {
    const id = pokemon.url.split("/").filter(Boolean).pop();
    return `https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${id}.svg`;
  };

  const handleSelect = (pokemon) => {
    const id = pokemon.url.split("/").filter(Boolean).pop();
    router.push(`/about?id=${id}`);
  };

  const handleDropdownChange = (e) => {
    const selectedName = e.target.value;
    const selectedPokemon = allPokemon.find((p) => p.name === selectedName);
    if (selectedPokemon) {
      handleSelect(selectedPokemon);
    }
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
  };

  const filteredPokemon = searchQuery
    ? allPokemon.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visiblePokemon;

  return (
    <main className="min-h-screen bg-gray-100 p-10">
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold mr-6">Pokemon</h1>

        <select
          className="border rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleDropdownChange}
          defaultValue=""
        >
          <option value="" disabled>
            Select a Pokemon...
          </option>
          {allPokemon.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search Pokemon..."
          className="border rounded px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />

        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Search
        </button>
      </div>
      {!searchQuery && (
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
            disabled={offset <= 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <div>
            {offset + 1} - {Math.min(offset + limit, count)} of {count}
          </div>
          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={offset + limit >= count}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {filteredPokemon.map((pokemon) => (
          <div
            key={pokemon.name}
            onClick={() => handleSelect(pokemon)}
            className="cursor-pointer bg-white p-4 rounded shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={getImage(pokemon)}
              alt={pokemon.name}
              className="w-full h-24 object-contain"
            />
            <p className="text-center capitalize mt-2">{pokemon.name}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
