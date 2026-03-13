/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
// import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
async create(@Body() createInvoiceDto: any) { // Pakai 'any' dulu sementara untuk debug
  console.log('Data masuk ke Controller:', createInvoiceDto); // Cek terminal NestJS
  return this.invoicesService.create(createInvoiceDto);
}

  @Get()
  findAll() {
    return this.invoicesService.findAll();
  }

  @Patch(':id/status')
updateStatus(@Param('id') id: string, @Body('status') status: string) {
  return this.invoicesService.updateStatus(id, status);
}

@Get('stats')
getStats() {
  return this.invoicesService.getStats();
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(id); // <--- Hapus tanda +
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInvoiceDto: UpdateInvoiceDto) {
    return this.invoicesService.update(id, updateInvoiceDto); // <--- Hapus tanda +
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(id); // <--- Hapus tanda +
  }
}
