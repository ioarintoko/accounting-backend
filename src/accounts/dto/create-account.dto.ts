/* eslint-disable prettier/prettier */
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

// Sesuaikan dengan Enum yang ada di schema.prisma Mas
export enum AccountType {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  code: string; // Contoh: "1101"

  @IsString()
  @IsNotEmpty()
  name: string; // Contoh: "Bank BCA"

  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;
}