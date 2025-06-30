import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { MyPokemonsService } from './my-pokemons.service';
import { Pokemon } from '../types/pokemon.types';
import { CreateMyPokemonDto } from './dto/create-my-pokemon.dto';
import { handleControllerError } from '../common/handle-controller-error';

@Controller('my-pokemons')
export class MyPokemonsController {
  private readonly logger = new Logger(MyPokemonsController.name);

  constructor(private readonly service: MyPokemonsService) {}

  @Get()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<Pokemon[]> {
    try {
      const result = await this.service.getAll(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
        sort,
        order,
        search,
      );
      this.logger.log(
        `Fetched my pokemons (count: ${result.length}) with params: limit=${limit}, offset=${offset}, sort=${sort}, order=${order}, search=${search}`,
      );
      return result;
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid query parameters',
        'Failed to fetch my pokemons',
      );
    }
  }

  @Get('count')
  async count(): Promise<{ count: number }> {
    try {
      const count = await this.service.count();
      this.logger.log(`Fetched my pokemons count: ${count}`);
      return { count };
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid query parameters',
        'Failed to fetch my pokemons count',
      );
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Pokemon | null> {
    try {
      const pokemon = await this.service.getById(Number(id));
      if (!pokemon) {
        throw new NotFoundException(`Pokemon with id ${id} not found`);
      }
      this.logger.log(`Fetched my pokemon with id: ${id}`);
      return pokemon;
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        `Pokemon with id ${id} not found`,
        'Invalid ID parameter',
        'Failed to fetch my pokemon',
      );
    }
  }
}
