import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonSchema } from '../schemas/pokemon.schema';
import { AllPokemonsRepo } from './all-pokemons.repo';
import { AllPokemonsService } from './all-pokemons.service';
import { AllPokemonsController } from './all-pokemons.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AllPokemon', schema: PokemonSchema, collection: 'allPokemons' },
    ]),
    UsersModule,
  ],
  providers: [AllPokemonsRepo, AllPokemonsService],
  controllers: [AllPokemonsController],
  exports: [AllPokemonsService],
})
export class AllPokemonsModule {}
