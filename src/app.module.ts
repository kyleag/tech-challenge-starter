import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppResolver } from '@src/app.resolver';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/employee.module';
import { PartnerModule } from './partner/partner.module';
import { VoucherModule } from './voucher/voucher.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    CompanyModule,
    EmployeeModule,
    PartnerModule,
    VoucherModule,
    OrderModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
