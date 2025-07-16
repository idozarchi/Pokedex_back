import { IsInt, IsString, IsOptional, IsArray } from 'class-validator';

export class CreateMyPokemonDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsInt()
  power: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  powerLevel?: number;

  @IsInt()
  @IsOptional()
  HP?: number;

  @IsString()
  @IsOptional()
  height?: string;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsArray()
  @IsOptional()
  abilities?: string[];

  @IsInt()
  @IsOptional()
  speed?: number;
}
