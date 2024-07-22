import { Module } from '@nestjs/common';
import { PaymentsModule } from './payments/payments.module';
import { HealthCheckModule } from './health-check/healt-check.module';

@Module({
  imports: [PaymentsModule, HealthCheckModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
