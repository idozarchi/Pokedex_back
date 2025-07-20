import { IsNumber } from 'class-validator';

export class StartFightDto {
  @IsNumber()
  userPokemonId: number;
}
