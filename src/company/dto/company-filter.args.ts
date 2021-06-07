import { ArgsType, Field } from '@nestjs/graphql';
import { EmployeeFilterInput } from '@src/employee/dto/employee-filter.input';

@ArgsType()
export class CompanyFilterArgs {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => EmployeeFilterInput, { nullable: true })
  employees?: EmployeeFilterInput;
}
