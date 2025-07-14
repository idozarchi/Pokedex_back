import { Controller, Post, Body, Logger } from '@nestjs/common';
import { FightService } from './fight.service';
import { StartFightDto } from './dto/start-fight.dto';
import { AttackDto } from './dto/attack.dto';
import { CatchDto } from './dto/catch.dto';

function handleControllerError(
  error: any,
  logger: Logger,
  context?: string,
  validationMsg?: string,
  generalMsg?: string,
) {
  if (error?.name === 'ValidationError' && validationMsg) {
    logger.warn(`${validationMsg}: ${error.message}`);
  } else if (generalMsg) {
    logger.error(`${generalMsg}: ${error.message}`);
  } else {
    logger.error(error.message);
  }
}

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
      throw error;
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
      throw error;
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
      throw error;
    }
  }

  @Post('switch-pokemon')
  async switchPokemon(
    @Body() body: { fightId: string; newPokemonId: number }
  ) {
    return this.service.switchUserPokemon(body.fightId, body.newPokemonId);
  }
}
