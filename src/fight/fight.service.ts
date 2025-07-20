import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StartFightDto } from './dto/start-fight.dto';
import { AttackDto } from './dto/attack.dto';
import { CatchDto } from './dto/attack.dto';
import { FightRepo } from './fight.repo';
import { FightState } from '../types/fight-state.types';
import { randomUUID } from 'crypto';
import { AllPokemonsService } from '../allPokemons/all-pokemons.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { Pokemon } from '../schemas/pokemon.schema';
import { getRandomOpponentPokemon } from '../utiles/getRandomOpponentPokemon';
import { handleCatchPokemon } from '../utiles/handleSuccessfulCatch';
import { handleAttack } from '../utiles/handleAttack';

@Injectable()
export class FightService {
  constructor(
    private readonly fightRepo: FightRepo,
    private readonly allPokemonsService: AllPokemonsService,
    private readonly usersService: UsersService,
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

  async startFight(dto: StartFightDto, user: User) {
    if (!user.ownedPokemons.includes(dto.userPokemonId)) {
      throw new NotFoundException('User does not own this pokemon');
    }

    const userPokemon = await this.allPokemonsService.getById(
      dto.userPokemonId,
    );
    if (!userPokemon) {
      throw new NotFoundException('Pokemon not found');
    }

    const opponentPokemon = await getRandomOpponentPokemon(
      this.allPokemonsService,
      user,
    );

    const userPokemonHP = userPokemon.HP || 100;
    const opponentPokemonHP = opponentPokemon.HP || 100;

    const turn =
      (userPokemon.speed ?? 0) > (opponentPokemon.speed ?? 0)
        ? 'user'
        : 'opponent';

    const fightId = randomUUID();
    const fightState: FightState = {
      fightId,
      userPokemon: userPokemon as Pokemon,
      opponentPokemon: opponentPokemon as Pokemon,
      userPokemonHP,
      opponentPokemonHP,
      turn,
      battleLog: [],
      winnerId: null,
      status: 'in-progress',
      catchAttempts: 0,
    };

    await this.fightRepo.createFight(fightState);

    const updatedFights = [...user.fights, fightId];
    await this.usersService.update(user.userId, { fights: updatedFights });

    return {
      fightId,
      user: userPokemon,
      opponent: opponentPokemon,
      starter: turn,
    };
  }

  async attack(dto: AttackDto, user: User) {
    const fight = await this.getActiveFightOrThrow(dto.fightId);

    return await handleAttack(
      fight,
      dto,
      this.fightRepo,
      this.usersService,
      user,
    );
  }

  async catchPokemon(dto: CatchDto, user: User) {
    const fight = await this.getActiveFightOrThrow(dto.fightId);

    return await handleCatchPokemon(
      fight,
      dto,
      this.fightRepo,
      this.usersService,
      user,
    );
  }

  async switchUserPokemon(fightId: string, newPokemonId: number, user: User) {
    const fight = await this.fightRepo.getFight(fightId);
    if (!fight) throw new NotFoundException('Fight not found');

    if (!user.ownedPokemons.includes(newPokemonId)) {
      throw new NotFoundException('User does not own this pokemon');
    }

    const newPokemon = await this.allPokemonsService.getById(newPokemonId);
    if (!newPokemon) throw new NotFoundException('Pokemon not found');

    fight.userPokemon = newPokemon as Pokemon;
    fight.userPokemonHP = newPokemon.HP ?? 100;
    await this.fightRepo.updateFight(fightId, fight);

    return {
      success: true,
      fight: fight,
    };
  }

  async getFight(fightId: string, user: User) {
    const fight = await this.fightRepo.getFight(fightId);
    if (!fight) {
      throw new NotFoundException('Fight not found');
    }

    if (!user.fights.includes(fightId)) {
      throw new NotFoundException('Fight not found');
    }

    return fight;
  }
}
