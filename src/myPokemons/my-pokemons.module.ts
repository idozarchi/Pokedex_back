import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonSchema } from '../schemas/pokemon.schema';
import { MyPokemonsRepo } from './my-pokemons.repo';
import { MyPokemonsService } from './my-pokemons.service';
import { MyPokemonsController } from './my-pokemons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'MyPokemon', schema: PokemonSchema }]),
  ],
  controllers: [MyPokemonsController],
  providers: [MyPokemonsService, MyPokemonsRepo],
  exports: [MyPokemonsService],
})
export class MyPokemonsModule {}
