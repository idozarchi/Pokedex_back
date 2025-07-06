import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'pokemons' })
export class Pokemon extends Document {
  @Prop({ required: true, unique: true })
  declare id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  power: number;

  @Prop()
  image?: string;

  @Prop()
  description?: string;

  @Prop()
  powerLevel?: number;

  @Prop()
  HP?: number;

  @Prop()
  height?: string;

  @Prop()
  weight?: string;

  @Prop()
  category?: string;

  @Prop({ type: [String] })
  abilities?: string[];

  @Prop()
  speed?: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
