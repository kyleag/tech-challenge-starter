import { Args, Query, Resolver } from '@nestjs/graphql';
import { PartnerFilter } from './dto/partner-filter.args';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Resolver()
export class PartnerResolver {
  constructor(private readonly partnerService: PartnerService) {}

  @Query(() => [Partner])
  partners(): Partner[] {
    // typecasting raw partner to raw model since they currently have the same fields
    return this.partnerService.getAll() as Partner[];
  }

  @Query(() => Partner)
  partner(@Args() filter: PartnerFilter): Partner {
    // typecasting raw partner to raw model since they currently have the same fields
    return this.partnerService.getOne(filter) as Partner;
  }
}
