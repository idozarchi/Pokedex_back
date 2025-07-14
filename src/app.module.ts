import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AllPokemonsModule } from './allPokemons/all-pokemons.module';
import { FightModule } from './fight/fight.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [DatabaseModule, AllPokemonsModule, FightModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
