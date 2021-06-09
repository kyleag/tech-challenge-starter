import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class PartnerFilter {
  @Field(() => Number, { nullable: true })
  id?: number;

  @Field(() => String, { nullable: true })
  name?: string;
}
