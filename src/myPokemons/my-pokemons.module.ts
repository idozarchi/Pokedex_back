import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from '../schemas/pokemon.schema';
import { MyPokemonsRepo } from './my-pokemons.repo';
import { MyPokemonsService } from './my-pokemons.service';
import { MyPokemonsController } from './my-pokemons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Pokemon.name, schema: PokemonSchema, collection: 'myPokemons' },
    ]),
  ],
  providers: [MyPokemonsRepo, MyPokemonsService],
  controllers: [MyPokemonsController],
  exports: [MyPokemonsService],
})
export class MyPokemonsModule {}
