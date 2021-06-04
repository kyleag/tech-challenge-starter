import { ObjectType } from '@nestjs/graphql';
import { PartnerRaw } from './dto/partner.raw';

@ObjectType()
export class Partner extends PartnerRaw {}
