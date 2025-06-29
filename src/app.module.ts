import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AllPokemonsModule } from './allPokemons/all-pokemons.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MyPokemonsModule } from './myPokemons/my-pokemons.module';

@Module({
  imports: [DatabaseModule, AllPokemonsModule, MyPokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
