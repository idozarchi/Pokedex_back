import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  userId: string;

  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [Number], default: [] })
  ownedPokemons: number[];

  @Prop({ type: [String], default: [] })
  fights: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
