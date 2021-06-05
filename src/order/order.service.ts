import orders from '@data/orders';
import { Injectable } from '@nestjs/common';
import FileSourceDatabaseService from '@src/common/services/database/file-source.service';
import { Order } from './order.model';

@Injectable()
export class OrderService extends FileSourceDatabaseService<Order> {
  constructor() {
    super(orders);
  }
}
