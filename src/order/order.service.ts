import orders from '@data/orders';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { OrderRaw } from './dto/order.raw';

@Injectable()
export class OrderService extends FileSourceDatabaseService<OrderRaw> {
  constructor() {
    super(orders);
  }
}
