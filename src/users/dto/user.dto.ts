import { IsEmail, IsOptional, IsString, IsArray } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userId: string;

  @IsString()
  userName: string;

  @IsEmail()
  email: string;

  @IsArray()
  @IsString({ each: true })
  ownedPokemons: string[];

  @IsArray()
  @IsString({ each: true })
  fights: string[];
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  userName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ownedPokemons?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  fights?: string[];
}
