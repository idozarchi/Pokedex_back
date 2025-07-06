import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { AllPokemonsService } from './all-pokemons.service';
import { Pokemon } from '../types/pokemon.types';
import { ControllerErrorType } from '../common/controller-error-type.enum';
import { handleControllerError } from '../common/handle-controller-error';

@Controller('all-pokemons')
export class AllPokemonsController {
  private readonly logger = new Logger(AllPokemonsController.name);

  constructor(private readonly service: AllPokemonsService) {}

  @Get()
  async getAll(
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('sort') sort?: string,
    @Query('order') order?: string,
    @Query('search') search?: string,
  ): Promise<{ pokemons: Pokemon[]; ownedIds: number[] }> {
    try {
      const pokemons = await this.service.getAll(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
        sort,
        order,
        search,
      );

      const ids = pokemons.map((p) => p.id);

      const ownedIds = await this.service.getOwnedIds(ids);

      this.logger.log(
        `Fetched all pokemons (count: ${pokemons.length}) with params: limit=${limit}, offset=${offset}, sort=${sort}, order=${order}, search=${search}`,
      );
      return { pokemons, ownedIds };
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid query parameters',
        'Failed to fetch pokemons',
      );
    }
  }

  @Get('count')
  async count(): Promise<{ count: number }> {
    try {
      const count = await this.service.count();
      this.logger.log(`Fetched pokemons count: ${count}`);
      return { count };
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid query parameters',
        'Failed to fetch pokemons count',
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
      this.logger.log(`Fetched pokemon with id: ${id}`);
      return pokemon;
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        `Pokemon with id ${id} not found`,
        'Invalid ID parameter',
        'Failed to fetch pokemon',
      );
    }
  }
}
