import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PokemonSortField, SortOrder } from '../all-pokemons.controller';

export class GetAllPokemonsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be a number' })
  @Min(1)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset must be a number' })
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsEnum(PokemonSortField, { message: 'sort must be a valid sort field' })
  sort?: PokemonSortField;

  @IsOptional()
  @IsEnum(SortOrder, { message: 'order must be asc or desc' })
  order?: SortOrder;

  @IsOptional()
  @IsString()
  search?: string;
}
