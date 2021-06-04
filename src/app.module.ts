import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

import { AppResolver } from '@src/app.resolver';
import { CompanyModule } from './company/company.module';
import { EmployeeModule } from './employee/company.module';

@Module({
  imports: [
    CompanyModule,
    EmployeeModule,
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [AppResolver],
})
export class AppModule {}
