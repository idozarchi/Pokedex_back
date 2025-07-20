import { AllPokemonsService } from '../allPokemons/all-pokemons.service';
import { User } from '../users/schemas/user.schema';

export async function getRandomOpponentPokemon(
  allPokemonsService: AllPokemonsService,
  user?: User,
): Promise<any> {
  const allPokemons = await allPokemonsService.getAll();

  const userPokemonIds = user?.ownedPokemons || [];
  const availableOpponents = allPokemons.filter(
    (p) => !userPokemonIds.includes(p.id),
  );

  if (availableOpponents.length === 0) {
    throw new Error('No available opponent pokemons found');
  }

  return availableOpponents[
    Math.floor(Math.random() * availableOpponents.length)
  ];
}
