"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function About() {
  const searchParams = useSearchParams();
  const [pokemon, setPokemon] = useState(null);
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then((res) => res.json())
        .then(setPokemon);
    }
  }, [id]);

  if (!pokemon) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold capitalize mb-6 text-center">
        {pokemon.name}
      </h1>
      <img
        src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemon.id}.svg`}
        alt={pokemon.name}
        className="mx-auto w-40 h-40 mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="font-semibold mb-2">Types</h2>
          {pokemon.types.map((t) => (
            <p key={t.slot} className="capitalize">
              {t.type.name}
            </p>
          ))}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Abilities</h2>
          {pokemon.abilities.map((a) => (
            <p key={a.slot} className="capitalize">
              {a.ability.name}
            </p>
          ))}
        </div>
        <div>
          <h2 className="font-semibold mb-2">Stats</h2>
          {pokemon.stats.map((s) => (
            <p key={s.stat.name} className="capitalize">
              {s.stat.name}: {s.base_stat}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
