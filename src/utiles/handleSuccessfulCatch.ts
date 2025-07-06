import { FightState } from '../types/fight-state.types';
import { MyPokemonsService } from '../myPokemons/my-pokemons.service';
import { FightRepo } from '../fight/fight.repo';
import { CatchDto } from '../fight/dto/catch.dto';
import { setFightWinner } from './setFightWinner';

export async function handleSuccessfulCatchUtil(
  fight: FightState,
  dto: CatchDto,
  fightRepo: FightRepo,
  myPokemonsService: MyPokemonsService,
) {
  const finishedFight = setFightWinner(fight, true); // true = user wins
  await fightRepo.updateFight(dto.fightId, finishedFight);

  await myPokemonsService.create(fight.opponentPokemon);

  return {
    status: 'finished',
    winnerId: fight.userPokemon.id,
    message: 'Congratulations! You caught the Pokémon!',
  };
}
