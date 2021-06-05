import { Query, Resolver } from '@nestjs/graphql';
import { Partner } from './partner.model';
import { PartnerService } from './partner.service';

@Resolver()
export class PartnerResolver {
  constructor(private readonly partnerService: PartnerService) {}

  @Query(() => [Partner])
  partners(): Partner[] {
    return this.partnerService.getAll() as Partner[];
  }
}
