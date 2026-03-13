/* eslint-disable prettier/prettier */
import { IsString, IsArray, ValidateNested, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class JournalItemDto {
  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsNumber()
  @IsOptional()
  debit: number = 0;

  @IsNumber()
  @IsOptional()
  credit: number = 0;
}

export class CreateJournalDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => JournalItemDto)
  items: JournalItemDto[];
}