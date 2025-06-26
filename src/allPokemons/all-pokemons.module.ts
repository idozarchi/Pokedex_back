import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AllPokemonSchema } from './all-pokemon.schema';
import { AllPokemonsRepo } from './all-pokemons.repo';
import { AllPokemonsService } from './all-pokemons.service';
import { AllPokemonsController } from './all-pokemons.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AllPokemon', schema: AllPokemonSchema },
    ]),
  ],
  providers: [AllPokemonsRepo, AllPokemonsService],
  controllers: [AllPokemonsController],
  exports: [AllPokemonsService],
})
export class AllPokemonsModule {}
