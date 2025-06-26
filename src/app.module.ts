import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AllPokemonsModule } from './allPokemons/all-pokemons.module';

@Module({
  imports: [DatabaseModule, AllPokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
