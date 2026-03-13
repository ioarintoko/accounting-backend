/* eslint-disable prettier/prettier */
export class CreateInvoiceItemDto {
  description: string;
  quantity: number;
  price: number;
}

export class CreateInvoiceDto {
  invoiceNumber: string;
  customerName: string;
  date: string;
  dueDate: string;
  items: CreateInvoiceItemDto[]; // <--- WAJIB ADA INI
}