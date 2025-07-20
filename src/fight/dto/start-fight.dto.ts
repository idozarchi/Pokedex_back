import { IsNumber, IsOptional } from 'class-validator';

export class StartFightDto {
  @IsNumber()
  userPokemonId: number;

  @IsOptional()
  @IsNumber()
  opponentId?: number;
}
