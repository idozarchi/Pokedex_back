import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class SwitchPokemonDto {
  @IsString()
  @IsNotEmpty()
  fightId: string;

  @IsNumber()
  @IsNotEmpty()
  newPokemonId: number;
}
