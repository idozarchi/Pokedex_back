import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './database/database.module';
import { AllPokemonsModule } from './allPokemons/all-pokemons.module';

@Module({
  imports: [MongoModule, AllPokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
