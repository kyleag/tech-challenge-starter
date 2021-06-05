import { ObjectType } from '@nestjs/graphql';
import { CompanyRaw } from './dto/company.raw';

@ObjectType()
export class Company extends CompanyRaw {}
