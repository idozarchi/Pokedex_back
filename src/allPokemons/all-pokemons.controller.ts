import {
  Controller,
  Get,
  Param,
  Query,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { AllPokemonsService } from './all-pokemons.service';
import { Pokemon } from '../types/pokemon.types';

enum ControllerErrorType {
  CastError = 'CastError',
  ValidationError = 'ValidationError',
  NotFoundException = 'NotFoundException',
}

function handleControllerError(
  error: Error,
  logger: Logger,
  notFoundMsg?: string,
  badRequestMsg?: string,
  internalMsg?: string,
): never {
  logger.error(error.message, error.stack);
  switch (error.name) {
    case ControllerErrorType.CastError:
    case ControllerErrorType.ValidationError:
      throw new BadRequestException(
        badRequestMsg || 'Invalid request parameters',
      );
    case ControllerErrorType.NotFoundException:
      throw new NotFoundException(notFoundMsg || 'Resource not found');
    default:
      throw new InternalServerErrorException(
        internalMsg || 'Internal server error',
      );
  }
}

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
  ): Promise<Pokemon[]> {
    try {
      return await this.service.getAll(
        limit ? Number(limit) : undefined,
        offset ? Number(offset) : undefined,
        sort,
        order,
        search,
      );
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
