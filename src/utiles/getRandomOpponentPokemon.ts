import { MyPokemonsService } from '../myPokemons/my-pokemons.service';
import { AllPokemonsService } from '../allPokemons/all-pokemons.service';

export async function getRandomOpponentPokemon(
  myPokemonsService: MyPokemonsService,
  allPokemonsService: AllPokemonsService
): Promise<any> {
  const userPokemons = await myPokemonsService.getAll();
  const userPokemonIds = userPokemons.map((p) => p.id);
  const allPokemons = await allPokemonsService.getAll();

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