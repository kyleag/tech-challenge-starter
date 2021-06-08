import orders from '@data/orders';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import DateFilter from '@src/common/types/date-filter';
import { OrderRaw } from './dto/order.raw';

interface OrderFilter
  extends Partial<Omit<{ [key in keyof OrderRaw]: any }, 'date'>> {
  date?: DateFilter;
}
interface OrderFilterDateCallback extends Partial<Omit<OrderFilter, 'date'>> {
  date?: DateFilterCallback;
}
type DateFilterCallback = (dateToCheck: Date) => boolean;

@Injectable()
export class OrderService extends FileSourceDatabaseService<OrderRaw> {
  constructor() {
    super(orders);
  }
  getAll({ date, ...filters }: OrderFilter): OrderRaw[] {
    // update date filter to a callback function
    const updatedFilter = { ...filters } as OrderFilterDateCallback;
    if (date) {
      updatedFilter.date = (dateToCheck: Date) => {
        const from = new Date(date.from);
        const to = date.to ? new Date(date.to) : new Date();
        return from <= dateToCheck && to >= dateToCheck;
      };
    }
    return super.getAll(updatedFilter);
  }
}
