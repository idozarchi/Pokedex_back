import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from './schemas/user.schema';
import { Pokemon } from '../schemas/pokemon.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findById(userId: string): Promise<User | null> {
    return this.usersRepository.findById(userId);
  }

  async count(): Promise<number> {
    return this.usersRepository.count();
  }

  async create(user: Partial<User>): Promise<User> {
    return this.usersRepository.create(user);
  }

  async update(userId: string, user: Partial<User>) {
    return this.usersRepository.update(userId, user);
  }

  async getUserPokemons(user: User): Promise<Pokemon[]> {
    return this.usersRepository.getUserPokemons(user);
  }
}
