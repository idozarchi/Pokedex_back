import { IsString } from 'class-validator';

export class AttackDto {
  @IsString()
  fightId: string;
}
