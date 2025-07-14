import { FightState } from '../types/fight-state.types';
import { FightRepo } from '../fight/fight.repo';
import { CatchDto } from '../fight/dto/attack.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { BadRequestException } from '@nestjs/common';

export async function handleCatchPokemon(
  fight: FightState,
  dto: CatchDto,
  fightRepo: FightRepo,
  usersService: UsersService,
  user: User,
) {
  if (fight.turn !== 'user') {
    throw new BadRequestException(
      'Only the user can attempt to catch the Pokémon on their turn',
    );
  }

  if (fight.catchAttempts >= 3) {
    fight.status = 'finished';
    fight.winnerId = fight.opponentPokemon.id;
    await fightRepo.updateFight(dto.fightId, fight);
    return {
      status: 'finished',
      winnerId: fight.opponentPokemon.id,
      message: 'You have used all your catch attempts. You lost the fight.',
    };
  }
  fight.catchAttempts += 1;

  const maxHP = fight.opponentPokemon.HP || 100;
  const currentHP = fight.opponentPokemonHP;
  const hpPercent = (currentHP / maxHP) * 100;

  if (hpPercent > 30) {
    if (fight.catchAttempts >= 3) {
      fight.status = 'finished';
      fight.winnerId = fight.opponentPokemon.id;
      await fightRepo.updateFight(dto.fightId, fight);
      return {
        status: 'finished',
        winnerId: fight.opponentPokemon.id,
        message: 'You have used all your catch attempts. You lost the fight.',
      };
    } else {
      await fightRepo.updateFight(dto.fightId, fight);
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
    await fightRepo.updateFight(dto.fightId, fight);

    if (!user.ownedPokemons.includes(fight.opponentPokemon.id)) {
      const updatedOwnedPokemons = [
        ...user.ownedPokemons,
        fight.opponentPokemon.id,
      ];
      await usersService.update(user.userId, {
        ownedPokemons: updatedOwnedPokemons,
      });
    }

    return {
      status: 'finished',
      winnerId: fight.userPokemon.id,
      message: 'Congratulations! You caught the Pokémon!',
    };
  } else {
    if (fight.catchAttempts >= 3) {
      fight.status = 'finished';
      fight.winnerId = fight.opponentPokemon.id;
      await fightRepo.updateFight(dto.fightId, fight);
      return {
        status: 'finished',
        winnerId: fight.opponentPokemon.id,
        message: 'You have used all your catch attempts. You lost the fight.',
      };
    } else {
      await fightRepo.updateFight(dto.fightId, fight);
      return {
        status: 'in-progress',
        attemptsLeft: 3 - fight.catchAttempts,
        message: 'Catch failed! Try again.',
      };
    }
  }
}
