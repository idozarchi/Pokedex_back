import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex';

function getStat(stats: any[], statName: string) {
  const stat = stats.find((s) => s.stat.name === statName);
  return stat ? stat.base_stat : undefined;
}

async function fetchDescription(nameOrId: string) {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${nameOrId}`,
  );
  const data = await res.json();
  const entry = data.flavor_text_entries.find(
    (e: any) => e.language.name === 'en',
  );
  return entry ? entry.flavor_text.replace(/\f/g, ' ') : '';
}

async function main() {
  await mongoose.connect(uri);
  const db = mongoose.connection;
  const AllPokemon = db.collection('allPokemons');

  // Fetch all pokemon names/ids
  const listRes = await fetch(
    'https://pokeapi.co/api/v2/pokemon?limit=150&offset=0',
  );
  const listData = await listRes.json();
  const pokemons = listData.results;

  for (const p of pokemons) {
    const detailsRes = await fetch(p.url);
    const details = await detailsRes.json();
    const description = await fetchDescription(details.id);
    const pokemon = {
      id: details.id,
      name: details.name,
      image: details.sprites.other?.['official-artwork']?.front_default,
      description,
      powerLevel: details.base_experience,
      HP: getStat(details.stats, 'hp'),
      height: details.height,
      weight: details.weight,
      category: details.types[0]?.type.name,
      abilities: details.abilities.map((a: any) => a.ability.name),
      speed: getStat(details.stats, 'speed'),
      power: getStat(details.stats, 'attack'),
    };
    await AllPokemon.updateOne(
      { id: pokemon.id },
      { $set: pokemon },
      { upsert: true },
    );
    console.log(`Upserted: ${pokemon.name}`);
  }

  await mongoose.disconnect();
  console.log('All pokemons inserted/updated.');
}

main().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
