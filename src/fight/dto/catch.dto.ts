import { IsString } from 'class-validator';

export class CatchDto {
  @IsString()
  fightId: string;
}