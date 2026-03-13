/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/mapped-types';
import { CreateAccountDto } from '../dto/create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}