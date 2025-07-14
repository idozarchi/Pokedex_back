import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from '../schemas/pokemon.schema';
import { AllPokemonsRepo } from './all-pokemons.repo';
import { AllPokemonsService } from './all-pokemons.service';
import { AllPokemonsController } from './all-pokemons.controller';
import { MyPokemonsModule } from '../myPokemons/my-pokemons.module'; // <-- Import the module
import { MyPokemonsService } from 'src/myPokemons/my-pokemons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AllPokemon', schema: PokemonSchema, collection: 'allPokemons' },
    ]),
    MyPokemonsModule,
  ],
  providers: [AllPokemonsRepo, AllPokemonsService, MyPokemonsService],
  controllers: [AllPokemonsController],
  exports: [AllPokemonsService],
})
export class AllPokemonsModule {}
