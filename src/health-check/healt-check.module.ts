import { Module } from '@nestjs/common';
import { HealthCheckController } from './healt-check.controller';

@Module({
    controllers: [HealthCheckController]
})
export class HealthCheckModule { }
