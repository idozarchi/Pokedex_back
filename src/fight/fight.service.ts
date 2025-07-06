import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StartFightDto } from './dto/start-fight.dto';
import { AttackDto } from './dto/attack.dto';
import { CatchDto } from './dto/catch.dto';
import { FightRepo } from './fight.repo';
import { FightState } from '../types/fight-state.types';
import { randomUUID } from 'crypto';
import { MyPokemonsService } from '../myPokemons/my-pokemons.service';
import { AllPokemonsService } from '../allPokemons/all-pokemons.service';
import { calculateNewLifeBar } from '../utiles/calculateNewLifeBar';
import { updateFightAfterAttack } from '../utiles/updateFightAfterAttack';
import { getRandomOpponentPokemon } from '../utiles/getRandomOpponentPokemon';

@Injectable()
export class FightService {
  constructor(
    private readonly fightRepo: FightRepo,
    private readonly myPokemonsService: MyPokemonsService,
    private readonly allPokemonsService: AllPokemonsService,
  ) {}

  private async getActiveFightOrThrow(fightId: string): Promise<FightState> {
    const fight = await this.fightRepo.getFight(fightId);
    if (!fight) {
      throw new NotFoundException('Fight not found');
    }
    if (fight.status !== 'in-progress') {
      throw new BadRequestException('Fight is already finished');
    }
    return fight;
  }

  async startFight(dto: StartFightDto) {
    const userPokemon = await this.myPokemonsService.getById(dto.userPokemonId);
    if (!userPokemon) {
      throw new NotFoundException('User pokemon not found');
    }

    const opponentPokemon = await getRandomOpponentPokemon(
      this.myPokemonsService,
      this.allPokemonsService,
    );

    const userPokemonHP = userPokemon.HP || userPokemon.HP || 100;
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
      catchAttempts: 0,
    };

    await this.fightRepo.createFight(fightState);

    return {
      fightId,
      user: userPokemon,
      opponent: opponentPokemon,
      starter: turn,
    };
  }

  async attack(dto: AttackDto) {
    const fight = await this.getActiveFightOrThrow(dto.fightId);

    const isUserTurn = fight.turn === 'user';
    const attacker = isUserTurn ? fight.userPokemon : fight.opponentPokemon;
    const defender = isUserTurn ? fight.opponentPokemon : fight.userPokemon;
    const defenderHPKey = isUserTurn ? 'opponentPokemonHP' : 'userPokemonHP';

    const currentLife = fight[defenderHPKey];
    const newLife = calculateNewLifeBar(attacker, defender, currentLife);

    const logEntry = {
      turn: fight.turn,
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
    const fight = await this.getActiveFightOrThrow(dto.fightId);

    if (fight.turn !== 'user') {
      throw new BadRequestException(
        'Only the user can attempt to catch the Pokémon on their turn',
      );
    }

    if (fight.catchAttempts >= 3) {
      fight.status = 'finished';
      fight.winnerId = fight.opponentPokemon.id;
      await this.fightRepo.updateFight(dto.fightId, fight);
      return {
        status: 'finished',
        winnerId: fight.opponentPokemon.id,
        message: 'You have used all your catch attempts. You lost the fight.',
      };
    }
    fight.catchAttempts += 1;

    const maxHP = fight.opponentPokemon.HP || fight.opponentPokemon.HP || 100;
    const currentHP = fight.opponentPokemonHP;
    const hpPercent = (currentHP / maxHP) * 100;
    if (hpPercent > 30) {
      if (fight.catchAttempts >= 3) {
        fight.status = 'finished';
        fight.winnerId = fight.opponentPokemon.id;
        await this.fightRepo.updateFight(dto.fightId, fight);
        return {
          status: 'finished',
          winnerId: fight.opponentPokemon.id,
          message: 'You have used all your catch attempts. You lost the fight.',
        };
      } else {
        await this.fightRepo.updateFight(dto.fightId, fight);
        return {
          status: 'in-progress',
          attemptsLeft: 3 - fight.catchAttempts,
          message: 'Catch failed! The opponent Pokémon has too much HP!',
        };
      }
    }

    const catchSuccess = Math.random() >= 0.2;

    if (catchSuccess) {
      fight.status = 'finished';
      fight.winnerId = fight.userPokemon.id;
      await this.fightRepo.updateFight(dto.fightId, fight);

      await this.myPokemonsService.create(fight.opponentPokemon);

      return {
        status: 'finished',
        winnerId: fight.userPokemon.id,
        message: 'Congratulations! You caught the Pokémon!',
      };
    } else {
      if (fight.catchAttempts >= 3) {
        fight.status = 'finished';
        fight.winnerId = fight.opponentPokemon.id;
        await this.fightRepo.updateFight(dto.fightId, fight);
        return {
          status: 'finished',
          winnerId: fight.opponentPokemon.id,
          message: 'You have used all your catch attempts. You lost the fight.',
        };
      } else {
        await this.fightRepo.updateFight(dto.fightId, fight);
        return {
          status: 'in-progress',
          attemptsLeft: 3 - fight.catchAttempts,
          message: 'Catch failed! Try again.',
        };
      }
    }
  }

  async switchUserPokemon(fightId: string, newPokemonId: number) {
    const fight = await this.fightRepo.getFight(fightId);
    if (!fight) throw new NotFoundException('Fight not found');
    const newPokemon = await this.myPokemonsService.getById(newPokemonId);
    if (!newPokemon) throw new NotFoundException('Pokemon not found');
    fight.userPokemon = newPokemon;
    fight.userPokemonHP = newPokemon.HP ?? 100;
    await this.fightRepo.updateFight(fightId, fight);
    return { success: true };
  }
}
