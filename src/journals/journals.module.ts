/* eslint-disable prettier/prettier */
// src/journals/journals.module.ts
import { Module } from '@nestjs/common';
import { JournalsService } from './journals.service';
import { JournalsController } from './journals.controller';
import { PrismaService } from '../prisma/prisma.service'; // Import ke sini

@Module({
  controllers: [JournalsController],
  providers: [JournalsService, PrismaService], // Daftarkan di providers
})
export class JournalsModule {}