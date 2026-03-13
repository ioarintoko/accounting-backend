/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AccountsService {
  constructor(private prisma: PrismaService) {}

  // 1. Create: Simpan akun baru ke Supabase
  async create(createAccountDto: CreateAccountDto) {
    return await this.prisma.account.create({
      data: createAccountDto,
    });
  }

  // 2. FindAll: Ambil semua list akun, urutkan berdasarkan kode (1000, 1100, dst)
  async findAll() {
    return await this.prisma.account.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }

  // 3. FindOne: Cari satu akun spesifik (pakai string ID karena biasanya UUID)
  async findOne(id: string) {
    const account = await this.prisma.account.findUnique({
      where: { id },
    });

    if (!account) {
      throw new NotFoundException(`Akun dengan ID ${id} tidak ditemukan.`);
    }

    return account;
  }

  // 4. Update: Ubah data akun (misal ganti nama atau kode)
  async update(id: string, updateAccountDto: UpdateAccountDto) {
    // Pastikan akunnya ada dulu sebelum diupdate
    await this.findOne(id);

    return await this.prisma.account.update({
      where: { id },
      data: updateAccountDto,
    });
  }

  // 5. Remove: Hapus akun
  async remove(id: string) {
    // Pastikan akunnya ada dulu sebelum didelete
    await this.findOne(id);

    return await this.prisma.account.delete({
      where: { id },
    });
  }
}