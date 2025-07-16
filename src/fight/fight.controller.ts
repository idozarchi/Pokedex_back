import {
  Controller,
  Post,
  Body,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { FightService } from './fight.service';
import { StartFightDto } from './dto/start-fight.dto';
import { AttackDto } from './dto/attack.dto';
import { CatchDto } from './dto/catch.dto';
import { SwitchPokemonDto } from './dto/switch-pokemon.dto';
import { handleControllerError } from '../utiles/handleControllerError';

@Controller('fight')
export class FightController {
  private readonly logger = new Logger(FightController.name);

  constructor(private readonly service: FightService) {}

  @Post('start')
  async startFight(@Body() dto: StartFightDto) {
    try {
      return await this.service.startFight(dto);
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid start fight parameters',
        'Failed to start fight',
      );
      throw new BadRequestException('Failed to start fight');
    }
  }

  @Post('attack')
  async attack(@Body() dto: AttackDto) {
    try {
      return await this.service.attack(dto);
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid attack parameters',
        'Failed to process attack',
      );
      throw new BadRequestException('Failed to process attack');
    }
  }

  @Post('catch')
  async catchPokemon(@Body() dto: CatchDto) {
    try {
      return await this.service.catchPokemon(dto);
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid catch parameters',
        'Failed to process catch',
      );
      throw new BadRequestException('Failed to catch Pokémon');
    }
  }

  @Post('switch-pokemon')
  async switchPokemon(@Body() dto: SwitchPokemonDto) {
    try {
      return await this.service.switchUserPokemon(
        dto.fightId,
        dto.newPokemonId,
      );
    } catch (error) {
      handleControllerError(
        error,
        this.logger,
        undefined,
        'Invalid switch Pokémon parameters',
        'Failed to switch Pokémon',
      );
      throw new BadRequestException('Failed to switch Pokémon');
    }
  }
}
