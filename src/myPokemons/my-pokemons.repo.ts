import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { Pokemon } from '../schemas/pokemon.schema';

@Injectable()
export class MyPokemonsRepo {
  constructor(
    @InjectModel('MyPokemon')
    private readonly myPokemonModel: Model<Pokemon>,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
    search?: string,
  ) {
    let filter: FilterQuery<Pokemon> = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    let query = this.myPokemonModel.find(filter);
    if (sort) {
      const sortOrder = order === 'desc' ? -1 : 1;
      query = query.sort({ [sort]: sortOrder });
    }
    if (typeof offset === 'number') query = query.skip(offset);
    if (typeof limit === 'number') query = query.limit(limit);
    return query.exec();
  }

  async findById(id: number) {
    return this.myPokemonModel.findOne({ id }).exec();
  }

  async count() {
    return this.myPokemonModel.countDocuments().exec();
  }

  async create(pokemon: Partial<Pokemon>) {
    const created = new this.myPokemonModel(pokemon);
    return created.save();
  }
}
