import { IsString } from 'class-validator';

export class AttackDto {
  @IsString()
  fightId: string;

  @IsString()
  move: string;
}