import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from '../schemas/pokemon.schema'; // Use the schema for correct typing

@Injectable()
export class AllPokemonsRepo {
  constructor(
    @InjectModel('AllPokemon')
    private readonly allPokemonModel: Model<Pokemon>,
  ) {}

  async findAll(
    limit?: number,
    offset?: number,
    sort?: string,
    order?: string,
    search?: string,
  ): Promise<Omit<Pokemon, keyof Document>[]> {
    // Return plain objects, not Mongoose docs
    const filter: Record<string, any> = {};
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    const sortObj = sort ? { [sort]: order === 'desc' ? -1 : 1 } : {};

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
