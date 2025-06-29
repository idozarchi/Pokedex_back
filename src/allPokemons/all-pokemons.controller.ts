import { Controller, Get, Param, Query } from '@nestjs/common';
import { AllPokemonsService } from './all-pokemons.service';
import { Pokemon } from '../types/pokemon.types';

@Controller('all-pokemons')
export class AllPokemonsController {
  constructor(private readonly service: AllPokemonsService) {}

  @Get()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<Pokemon[]> {
    return this.service.getAll(
      limit ? Number(limit) : undefined,
      offset ? Number(offset) : undefined,
      sort,
      order,
      search,
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
