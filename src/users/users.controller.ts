import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Query,
  UseGuards,
  BadRequestException,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CognitoGuard } from '../auth/cognito.guard';
import { UserExistsGuard } from '../auth/user-exists.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @UseGuards(CognitoGuard, UserExistsGuard)
  @Get(':userId')
  async getUserById(
    @Param('userId') userId: string,
    @CurrentUser() user: User,
  ): Promise<User | null> {
    try {
      this.logger.log(`Fetching user by id: ${userId}`);
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user by id: ${userId}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @Post()
  async createUser(@Body() userDto: Partial<User>): Promise<User> {
    try {
      this.logger.log(`Creating user with data: ${JSON.stringify(userDto)}`);
      return await this.usersService.create(userDto);
    } catch (error) {
      this.logger.error(
        `Error creating user: ${JSON.stringify(userDto)}`,
        error.stack,
      );
      if (error instanceof ConflictException) throw error;
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(CognitoGuard, UserExistsGuard)
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() userDto: Partial<User>,
    @CurrentUser() user: User,
  ) {
    try {
      this.logger.log(
        `Updating user ${userId} with data: ${JSON.stringify(userDto)}`,
      );
      return await this.usersService.update(userId, userDto);
    } catch (error) {
      this.logger.error(`Error updating user ${userId}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(CognitoGuard, UserExistsGuard)
  @Get('count/all')
  async countUsers(@CurrentUser() user: User): Promise<number> {
    try {
      this.logger.log(`Counting all users`);
      return await this.usersService.count();
    } catch (error) {
      this.logger.error(`Error counting users`, error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(CognitoGuard, UserExistsGuard)
  @Get(':userId/pokemons')
  async getUserPokemons(
    @Param('userId') userId: string,
    @CurrentUser() user: User,
    @Query('sort') sort?: string,
    @Query('order') order?: 'asc' | 'desc',
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
    @Query('search') search?: string,
  ) {
    try {
      this.logger.log(
        `Fetching pokemons for user: ${userId} with sort: ${sort}, order: ${order}, search: ${search}`,
      );

      const limitNum = limit ? parseInt(limit, 10) : undefined;
      const offsetNum = offset ? parseInt(offset, 10) : undefined;

      return await this.usersService.getUserPokemons(user, {
        sort,
        order,
        limit: limitNum,
        offset: offsetNum,
        search,
      });
    } catch (error) {
      this.logger.error(
        `Error fetching pokemons for user: ${userId}`,
        error.stack,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
