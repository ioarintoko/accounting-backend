/* eslint-disable prettier/prettier */
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Biar bisa dipakai di semua module tanpa perlu import satu-satu
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Ini kuncinya biar module lain bisa "pinjam"
})
export class PrismaModule {}