import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'allPokemons' })
export class AllPokemon extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;

  @Prop()
  powerLevel: number;

  @Prop()
  HP: number;

  @Prop()
  height: string;

  @Prop()
  weight: string;

  @Prop()
  category: string;

  @Prop({ type: [String] })
  abilities: string[];

  @Prop()
  speed: number;
}

export const AllPokemonSchema = SchemaFactory.createForClass(AllPokemon);
