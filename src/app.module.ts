/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AccountsModule } from './accounts/accounts.module';
import { JournalsModule } from './journals/journals.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [AccountsModule, JournalsModule, InvoicesModule],
  providers: [PrismaService],
})
export class AppModule {}