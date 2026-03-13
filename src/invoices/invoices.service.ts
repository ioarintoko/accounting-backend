/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

async create(createInvoiceDto: any) {
    return await this.prisma.$transaction(async (tx) => {
      const items = createInvoiceDto.items || [];
      const totalAmount = items.reduce(
        (acc, item) => acc + (item.quantity * item.price), 
        0
      );

      // 1. Simpan Invoice ke Database
      const invoice = await (tx as any).invoice.create({
        data: {
          invoiceNumber: createInvoiceDto.invoiceNumber,
          customerName: createInvoiceDto.customerName,
          date: new Date(createInvoiceDto.date || new Date()),
          dueDate: new Date(createInvoiceDto.dueDate),
          totalAmount: totalAmount,
          status: 'PENDING',
          items: {
            create: items.map(item => ({
              description: item.description || 'General Service',
              quantity: item.quantity || 1,
              price: item.price || 0,
              total: (item.quantity || 1) * (item.price || 0)
            })),
          },
        },
        include: { items: true },
      });

      // 2. OTOMATIS: Posting ke Jurnal menggunakan Account ID dari Frontend
      if (createInvoiceDto.receivableAccountId && createInvoiceDto.incomeAccountId) {
        await (tx as any).journal.create({
          data: {
            date: invoice.date,
            reference: invoice.invoiceNumber,
            description: `Revenue Recognition: ${invoice.customerName}`,
            totalAmount: totalAmount,
            items: {
              create: [
                { 
                  accountId: createInvoiceDto.receivableAccountId, 
                  debit: totalAmount, 
                  credit: 0 
                },
                { 
                  accountId: createInvoiceDto.incomeAccountId, 
                  debit: 0, 
                  credit: totalAmount 
                }
              ]
            }
          }
        });
      }

      return invoice;
    });
  }

  // Helper untuk cari ID berdasarkan kode (Opsional jika frontend butuh default)
  private async getAccountIdByCode(code: string, tx?: any): Promise<string> {
  // Gunakan tx kalau ada, kalau nggak pakai this.prisma
  const prismaClient = tx || this.prisma;
  
  const account = await (prismaClient as any).account.findFirst({
    where: { code: code },
  });
  
  if (!account) {
    throw new Error(`Account with code ${code} not found. Cek COA Mas Bram!`);
  }
  
  return account.id;
}

async updateStatus(id: string, status: string, bankAccountId?: string) {
  return await this.prisma.$transaction(async (tx) => {
    // 1. Ambil data invoice buat tahu piutang mana yang mau dikurangin
    const invoice = await (tx as any).invoice.findUnique({ where: { id } });

    // 2. Update status invoice
    const updatedInvoice = await (tx as any).invoice.update({
      where: { id },
      data: { status },
    });

    // 3. Jurnal Otomatis (Dinamis!)
    if (status === 'PAID' && bankAccountId) {
      await (tx as any).journal.create({
        data: {
          date: new Date(),
          reference: `PAY-${updatedInvoice.invoiceNumber}`,
          description: `Pelunasan: ${updatedInvoice.customerName}`,
          totalAmount: updatedInvoice.totalAmount,
          items: {
            create: [
              { 
                accountId: bankAccountId, // Akun Bank pilihan user di frontend
                debit: updatedInvoice.totalAmount, 
                credit: 0 
              },
              { 
                accountId: invoice.receivableAccountId, // Akun Piutang yang nempel di invoice
                debit: 0, 
                credit: updatedInvoice.totalAmount 
              }
            ]
          }
        }
      });
    }
    return updatedInvoice;
  });
}

  async findAll() {
    return await (this.prisma as any).invoice.findMany({
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // Find One Invoice
  async findOne(id: string) {
    return await (this.prisma as any).invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  // Update Invoice
  async update(id: string, updateInvoiceDto: any) {
    return await (this.prisma as any).invoice.update({
      where: { id },
      data: updateInvoiceDto,
    });
  }

  // Remove Invoice
  async remove(id: string) {
    return await (this.prisma as any).invoice.delete({
      where: { id },
    });
  }

  async getStats() {
  const stats = await this.prisma.invoice.groupBy({
    by: ['status'],
    _sum: {
      totalAmount: true,
    },
  });

  const formattedStats = {
    paid: stats.find(s => s.status === 'PAID')?._sum.totalAmount || 0,
    pending: stats.find(s => s.status === 'PENDING')?._sum.totalAmount || 0,
  };

  return formattedStats;
}
}