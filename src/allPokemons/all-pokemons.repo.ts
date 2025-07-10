import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Pokemon } from '../schemas/pokemon.schema';

export type MongoSortOrder = 1 | -1;

export enum PokemonSortField {
  Name = 'name',
  PowerLevel = 'powerLevel',
  HP = 'HP',
  Height = 'height',
  Weight = 'weight',
  Speed = 'speed',
  // Add more fields as needed
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

@Injectable()
export class AllPokemonsRepo {
  constructor(
    @InjectModel('AllPokemon')
    private readonly allPokemonModel: Model<Pokemon>,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
    sort?: PokemonSortField,
    order?: SortOrder,
    search?: string,
  ): Promise<Omit<Pokemon, keyof Document>[]> {
    const filter: FilterQuery<Pokemon> = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const sortObj: Record<string, MongoSortOrder> = sort
      ? { [sort]: order === SortOrder.Desc ? -1 : 1 }
      : {};

    return this.allPokemonModel
      .find(filter)
      .sort(sortObj)
      .skip(offset ?? 0)
      .limit(limit ?? 0)
      .lean()
      .exec();
  }

  async findById(id: number): Promise<Omit<Pokemon, keyof Document> | null> {
    return this.allPokemonModel.findOne({ id }).lean().exec();
  }

  async count(): Promise<number> {
    return this.allPokemonModel.countDocuments().exec();
  }
}
