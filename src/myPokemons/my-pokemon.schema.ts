import { Schema } from 'mongoose';

export const MyPokemonSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    description: { type: String },
    powerLevel: { type: Number },
    HP: { type: Number },
    height: { type: String },
    weight: { type: String },
    category: { type: String },
    abilities: [{ type: String }],
    speed: { type: Number },
  },
  { collection: 'myPokemons' },
);
