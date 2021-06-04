import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from '@src/common/models/base.model';

@ObjectType()

// using assertions (!) on fields to ignore issues with having no constructor
// see https://github.com/nestjs/nest/issues/4178#issuecomment-613197634
export class CompanyRaw extends BaseModel {
  @Field()
  title!: string;
}
