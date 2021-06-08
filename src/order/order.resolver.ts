import { Args, Query, Resolver } from '@nestjs/graphql';
import { Company } from '@src/company/company.model';
import { CompanyService } from '@src/company/company.service';
import { OrderFilterArgs } from '@src/order/dto/order-filter.args';
import { Employee } from '@src/employee/employee.model';
import { EmployeeService } from '@src/employee/employee.service';
import { Partner } from '@src/partner/partner.model';
import { PartnerService } from '@src/partner/partner.service';
import { Voucher } from '@src/voucher/voucher.model';
import { VoucherService } from '@src/voucher/voucher.service';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { OrderRaw } from './dto/order.raw';

@Resolver(() => Order)
export class OrderResolver {
  constructor(
    private readonly orderService: OrderService,
    private readonly employeeService: EmployeeService,
    private readonly voucherService: VoucherService,
    private readonly companyService: CompanyService,
    private readonly partnerService: PartnerService,
  ) {}

  @Query(() => [Order])
  async orders(@Args() filters: OrderFilterArgs = {}): Promise<Order[]> {
    return Promise.all(
      this.orderService.getAll(filters).map((rawOrder) => {
        return this._convertToModel(rawOrder);
      }),
    );
  }

  @Query(() => Order)
  async order(@Args() filters: OrderFilterArgs = {}): Promise<Order> {
    const result = this._convertToModel(this.orderService.getOne(filters));
    return Promise.resolve(result);
  }

  private _convertToModel(rawOrder: OrderRaw): Order {
    const { employeeId, voucherId, ...order } = rawOrder;
    const { companyId, ...employee } = this.employeeService.getById(employeeId);
    const { partnerId, ...voucher } = this.voucherService.getById(voucherId);
    return {
      ...order,
      // @TODO - use `ResolveField`?
      // doing this since testing this method *DOES NOT* automatically resolve the fields that need to be resolved
      // and it seems like the `ResolveField` only works when doing an actual graphql query
      employee: {
        ...employee,
        company: this.companyService.getById(companyId) as Company,
      } as Employee,
      voucher: {
        ...voucher,
        partner: this.partnerService.getById(partnerId) as Partner,
      } as Voucher,
    } as Order;
  }
}
