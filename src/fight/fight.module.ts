import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { FightRepo } from './fight.repo';
import { MyPokemonsModule } from '../myPokemons/my-pokemons.module';
import { AllPokemonsModule } from '../allPokemons/all-pokemons.module';
import { FightSchema } from './fight.schema';

@Module({
  imports: [
    MyPokemonsModule,
    AllPokemonsModule,
    MongooseModule.forFeature([{ name: 'Fight', schema: FightSchema }]),
  ],
  providers: [FightService, FightRepo],
  controllers: [FightController],
})
export class FightModule {}
