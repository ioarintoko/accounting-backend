/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const accounts = [
    { code: '1101', name: 'Kas Utama', type: 'ASSET' },
    { code: '1102', name: 'Bank BCA', type: 'ASSET' },
    { code: '1201', name: 'Piutang Usaha', type: 'ASSET' },
    { code: '4101', name: 'Pendapatan Jasa', type: 'REVENUE' },
    { code: '5101', name: 'Beban Gaji', type: 'EXPENSE' },
  ];

  for (const acc of accounts) {
    await prisma.account.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
  }

  const invoiceData = [
    {
      invoiceNumber: 'INV-2026-001',
      customerName: 'PT. Teknologi Maju',
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      totalAmount: 15000000,
      status: 'PAID',
      items: {
        create: [
          { description: 'Development Fee - Khonic System', quantity: 1, price: 15000000, total: 15000000 }
        ]
      }
    },
    {
      invoiceNumber: 'INV-2026-002',
      customerName: 'Manda Nugget Corp',
      date: new Date(),
      dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      totalAmount: 5000000,
      status: 'PENDING',
      items: {
        create: [
          { description: 'AI Integration Consulting', quantity: 2, price: 2500000, total: 5000000 }
        ]
      }
    }
  ];

  for (const inv of invoiceData) {
    await prisma.invoice.upsert({
      where: { invoiceNumber: inv.invoiceNumber },
      update: {},
      create: inv,
    });
  }

  console.log('Seed CoA & Invoices Berhasil! 🚀');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());