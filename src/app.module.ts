import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AllPokemonsModule } from './allPokemons/all-pokemons.module';
import { MyPokemonsModule } from './myPokemons/my-pokemons.module';
import { FightModule } from './fight/fight.module';

@Module({
  imports: [
    DatabaseModule,
    AllPokemonsModule,
    MyPokemonsModule,
    FightModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
