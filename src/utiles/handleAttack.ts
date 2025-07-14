import { FightState } from '../types/fight-state.types';
import { FightRepo } from '../fight/fight.repo';
import { AttackDto } from '../fight/dto/attack.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/schemas/user.schema';
import { calculateNewLifeBar } from './calculateNewLifeBar';
import { updateFightAfterAttack } from './updateFightAfterAttack';

export async function handleAttack(
  fight: FightState,
  dto: AttackDto,
  fightRepo: FightRepo,
  usersService: UsersService,
  user: User,
) {
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

  if (isUserTurn && defenderHPKey === 'opponentPokemonHP' && newLife <= 0) {
    if (!user.ownedPokemons.includes(fight.opponentPokemon.id)) {
      const updatedOwnedPokemons = [
        ...user.ownedPokemons,
        fight.opponentPokemon.id,
      ];
      await usersService.update(user.userId, {
        ownedPokemons: updatedOwnedPokemons,
      });
    }
  }

  await fightRepo.updateFight(dto.fightId, updatedFight);

  return {
    lifebar: newLife,
    turn: updatedFight.turn,
    log: logEntry,
    status: updatedFight.status || fight.status,
    winnerId: updatedFight.winnerId,
  };
}
