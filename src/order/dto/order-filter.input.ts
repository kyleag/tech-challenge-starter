import { InputType, Field } from '@nestjs/graphql';
import { DateFilterInput } from '@src/common/types/date-filter.input';

@InputType()
export class OrderFilterInput {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => Number, { nullable: true })
  employeeId?: number;

  @Field(() => Number, { nullable: true })
  voucherId?: number;

  @Field(() => DateFilterInput, { nullable: true })
  date?: DateFilterInput;
}
