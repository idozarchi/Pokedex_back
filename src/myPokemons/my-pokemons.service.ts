import { Injectable } from '@nestjs/common';
import { MyPokemonsRepo } from './my-pokemons.repo';
import { Pokemon } from '../schemas/pokemon.schema';

@Injectable()
export class MyPokemonsService {
  constructor(private readonly repo: MyPokemonsRepo) {}

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

  async create(pokemon: Partial<Pokemon>): Promise<Pokemon> {
    return this.repo.create(pokemon);
  }
}
