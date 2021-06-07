import { ArgsType, Field } from '@nestjs/graphql';
import { OrderFilterInput } from '@src/order/dto/order-filter.input';

@ArgsType()
export class EmployeeFilterArgs {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => Number, { nullable: true })
  name?: string;

  @Field(() => Number, { nullable: true })
  budget?: number;

  @Field(() => Number, { nullable: true })
  companyId?: number;

  @Field(() => OrderFilterInput, { nullable: true })
  orders?: OrderFilterInput;
}
