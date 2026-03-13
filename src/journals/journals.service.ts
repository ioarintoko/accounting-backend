/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
// src/journals/journals.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Pastikan kamu sudah buat PrismaService

@Injectable()
export class JournalsService {
  constructor(private prisma: PrismaService) {}

  async create(createJournalDto: any) {
    const { description, date, items } = createJournalDto;

    // 1. Validasi Balance: Total Debit harus sama dengan Total Kredit
    const totalDebit = items.reduce((sum, item) => sum + (item.debit || 0), 0);
    const totalCredit = items.reduce((sum, item) => sum + (item.credit || 0), 0);

    if (totalDebit !== totalCredit) {
      throw new BadRequestException(
        `Jurnal tidak balance! Debit: ${totalDebit}, Kredit: ${totalCredit}`
      );
    }

    // 2. Simpan ke Database menggunakan Transaction (Atomicity)
    return (this.prisma as any).journal.create({
      data: {
        description,
        date: new Date(date),
        items: {
          create: items.map((item) => ({
            accountId: item.accountId,
            debit: item.debit,
            credit: item.credit,
          })),
        },
      },
      include: { items: true },
    });
  }

  findAll() {
   return (this.prisma as any).journal.findMany({
  orderBy: {
    date: "desc", 
  },
  include: {
    items: {
      include: {
        account: true // <--- Tambahkan ini biar nama akunnya ikut ketarik
      }
    }
  }
});
  }
}