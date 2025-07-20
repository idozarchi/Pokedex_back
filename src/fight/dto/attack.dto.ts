import { IsString } from 'class-validator';

export class FightActionDto {
  @IsString()
  fightId: string;
}

export class AttackDto extends FightActionDto {}
export class CatchDto extends FightActionDto {}
