import { Module } from '@nestjs/common';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

@Module({
  providers: [PartnerResolver, PartnerService],
})
export class PartnerModule {}
