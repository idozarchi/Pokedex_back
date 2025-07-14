import { Injectable } from '@nestjs/common';
import { AllPokemonsRepo } from './all-pokemons.repo';
import { Pokemon } from '../types/pokemon.types';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AllPokemonsService {
  constructor(private readonly repo: AllPokemonsRepo) {}

  async getAll(
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
    search?: string,
  ): Promise<Pokemon[]> {
    return this.repo.findAll(limit, offset, sort, order, search);
  }

  async getById(id: number): Promise<Pokemon | null> {
    return this.repo.findById(id);
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async getOwnedIds(ids: number[], user: User): Promise<number[]> {
    return ids.filter((id) => user.ownedPokemons.includes(id));
  }
}
