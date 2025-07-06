import {
  Controller,
  Get,
  Param,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AllPokemonsService } from './all-pokemons.service';
import { Pokemon } from '../types/pokemon.types';
import { GetAllPokemonsDto } from './dto/get-all-pokemons.dto';

export enum PokemonSortField {
  Name = 'name',
  Power = 'power',
  HP = 'HP',
  Speed = 'speed',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

@Controller('all-pokemons')
export class AllPokemonsController {
  constructor(private readonly service: AllPokemonsService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getAll(@Query() query: GetAllPokemonsDto): Promise<Pokemon[]> {
    return this.service.getAll(
      query.limit,
      query.offset,
      query.sort,
      query.order,
      query.search,
    );
  }

  @Get('count')
  async count(): Promise<{ count: number }> {
    const count = await this.service.count();
    return { count };
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Pokemon | null> {
    return this.service.getById(Number(id));
  }
}
