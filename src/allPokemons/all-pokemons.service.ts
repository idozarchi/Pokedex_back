import { Injectable } from '@nestjs/common';
import { AllPokemonsRepo } from './all-pokemons.repo';
import { Pokemon } from '../types/pokemon.types';
import { MyPokemonsService } from 'src/myPokemons/my-pokemons.service';

@Injectable()
export class AllPokemonsService {
  constructor(
    private readonly repo: AllPokemonsRepo,
    private readonly myPokemonsService: MyPokemonsService,
  ) {}

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

  async getOwnedIds(ids: number[]): Promise<number[]> {
    const owned = await this.myPokemonsService.findManyByIds(ids);
    return owned.map((p) => p.id);
  }
}
