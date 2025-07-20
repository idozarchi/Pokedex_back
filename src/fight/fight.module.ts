import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FightService } from './fight.service';
import { FightController } from './fight.controller';
import { FightRepo } from './fight.repo';
import { AllPokemonsModule } from '../allPokemons/all-pokemons.module';
import { UsersModule } from '../users/users.module';
import { FightSchema } from './fight.schema';

@Module({
  imports: [
    AllPokemonsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Fight', schema: FightSchema }]),
  ],
  providers: [FightService, FightRepo],
  controllers: [FightController],
})
export class FightModule {}
