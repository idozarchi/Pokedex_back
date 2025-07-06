import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { StartFightDto } from './dto/start-fight.dto';
import { AttackDto } from './dto/attack.dto';
import { CatchDto } from './dto/catch.dto';
import { FightRepo, FightState } from './fight.repo';
import { randomUUID } from 'crypto';
import { MyPokemonsService } from '../myPokemons/my-pokemons.service';
import { AllPokemonsService } from '../allPokemons/all-pokemons.service';
import { calculateNewLifeBar } from '../utiles/calculateNewLifeBar';
import { updateFightAfterAttack } from '../utiles/updateFightAfterAttack';
import { getRandomOpponentPokemon } from '../utiles/getRandomOpponentPokemon';

@Injectable()
export class FightService {
  private readonly logger = new Logger(FightService.name);

  constructor(
    private readonly fightRepo: FightRepo,
    private readonly myPokemonsService: MyPokemonsService,
    private readonly allPokemonsService: AllPokemonsService,
  ) {}

  async startFight(dto: StartFightDto) {
    try {
      const userPokemon = await this.myPokemonsService.getById(
        dto.userPokemonId,
      );
      if (!userPokemon) {
        this.logger.error('User pokemon not found');
        throw new NotFoundException('User pokemon not found');
      }

      const opponentPokemon = await getRandomOpponentPokemon(
        this.myPokemonsService,
        this.allPokemonsService,
      );

      const userPokemonHP = 100;
      const opponentPokemonHP = 100;

      const turn =
        (userPokemon.speed ?? 0) > (opponentPokemon.speed ?? 0)
          ? 'user'
          : 'opponent';

      const fightId = randomUUID();
      const fightState: FightState = {
        fightId,
        userPokemon: userPokemon,
        opponentPokemon: opponentPokemon,
        userPokemonHP,
        opponentPokemonHP,
        turn,
        battleLog: [],
        winnerId: null,
        status: 'in-progress',
      };

      await this.fightRepo.createFight(fightState);

      return {
        fightId, // include fightId for frontend/attack endpoint
        user: userPokemon,
        opponent: opponentPokemon,
        starter: turn,
      };
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async attack(dto: AttackDto) {
    const fight = await this.fightRepo.getFight(dto.fightId);
    if (!fight) {
      throw new NotFoundException('Fight not found');
    }
    if (fight.status !== 'in-progress') {
      throw new Error('Fight is already finished');
    }

    const isUserTurn = fight.turn === 'user';
    const attacker = isUserTurn ? fight.userPokemon : fight.opponentPokemon;
    const defender = isUserTurn ? fight.opponentPokemon : fight.userPokemon;
    const defenderHPKey = isUserTurn ? 'opponentPokemonHP' : 'userPokemonHP';

    const maxLife = defender.HP || defender.HP || 100;
    const currentLife = fight[defenderHPKey];
    const power = attacker.power || attacker.powerLevel || 50;
    const newLife = calculateNewLifeBar(power, currentLife, maxLife);

    const logEntry = {
      turn: fight.turn,
      move: dto.move,
      damage: currentLife - newLife,
      result: newLife <= 0 ? 'KO' : 'hit',
      timestamp: new Date(),
    };

    const updatedFight = updateFightAfterAttack(
      fight,
      newLife,
      logEntry,
      isUserTurn,
    );

    await this.fightRepo.updateFight(dto.fightId, updatedFight);

    return {
      lifebar: newLife,
      turn: updatedFight.turn,
      log: logEntry,
      status: updatedFight.status || fight.status,
      winnerId: updatedFight.winnerId,
    };
  }

  async catchPokemon(dto: CatchDto) {
    const fight = await this.fightRepo.getFight(dto.fightId);
    if (!fight) {
      throw new NotFoundException('Fight not found');
    }
    // TODO: Implement catch logic and update fight state
    // Example: await this.fightRepo.updateFight(dto.fightId, { ...updates });
    return fight;
  }
}
