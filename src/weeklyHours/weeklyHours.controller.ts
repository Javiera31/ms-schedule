import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WeeklyHoursService } from './weeklyHours.service';
import { AuthJWTGuard } from 'src/schedule/guards/authJWT.guard';
import { RolesGuard } from 'src/schedule/guards/roles.guard';
import { Roles } from 'src/schedule/decorators/roles.decorator';
import { Role } from 'src/schedule/enums/role.enum';

@Controller('weekly-hours')
export class WeeklyHoursController {
    constructor(private readonly weeklyHoursService: WeeklyHoursService) {}

    @UseGuards(AuthJWTGuard,RolesGuard)
    @Roles(Role.Admin)
    @Post('findByUserIdAndDate')
    async findByUserIdAndDate(@Body() body: { inputDate: string, userId: number }) {
        const { inputDate, userId } = body;
        const date = new Date(inputDate);
        const data = {date, userId};
        return this.weeklyHoursService.findByUserIdAndDate(data);
    }

    @UseGuards(AuthJWTGuard,RolesGuard)
    @Roles(Role.Admin)
    @Post('compareUsersAttendance')
    async compareUsersAttendance(@Body() body: { inputDate: string, firstUserId: number, secondUserId: number }) {
        const { inputDate, firstUserId, secondUserId } = body;
        const date = new Date(inputDate);
        const data = {date, firstUserId, secondUserId};
        return this.weeklyHoursService.compareAttendance(data);
    }

}

//lista con dos listas. Primera lista interna es el primer userId, segunda es el segundo userId


