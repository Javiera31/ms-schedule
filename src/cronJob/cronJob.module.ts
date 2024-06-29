import { Module } from '@nestjs/common';
import { CronJobController } from './cronJob.controller';
import { CronJobService } from './cronJob.service';

@Module({
  controllers: [CronJobController],
  providers: [CronJobService ],
  exports: [CronJobService],
})
export class CronJobModule {}