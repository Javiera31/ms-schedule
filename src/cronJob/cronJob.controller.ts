import { Body, Controller, Get, UseGuards } from '@nestjs/common';
import { CronJobService } from './cronJob.service';
import { AuthJWTGuard } from 'src/schedule/guards/authJWT.guard';
import { RolesGuard } from 'src/schedule/guards/roles.guard';
import { Roles } from 'src/schedule/decorators/roles.decorator';
import { Role } from 'src/schedule/enums/role.enum';

@Controller('cron')
export class CronJobController {
  constructor(private readonly cronJobService: CronJobService) {}

  @Get()
  async updateWeeklyWorkHours() {
    try {
      await this.cronJobService.updateWeeklyHours();
      return { message: 'Weekly work hours updated successfully' };
    } catch (error) {
      return { error: 'Failed to update weekly work hours', details: error.message };
    }
  }

  @Get('updateMonthlyWorkHours')
  async updateMonthlyWorkHours() {
    try {
      await this.cronJobService.updateMonthlyHours();
      return { message: 'Weekly work hours updated successfully' };
    } catch (error) {
      return { error: 'Failed to update weekly work hours', details: error.message };
    }
  }

}