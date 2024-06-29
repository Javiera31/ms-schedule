import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/schedule/decorators/roles.decorator";
import { Role } from "src/schedule/enums/role.enum";
import { AuthJWTGuard } from "src/schedule/guards/authJWT.guard";
import { RolesGuard } from "src/schedule/guards/roles.guard";
import { MonthlyHoursService } from "./monthlyHours.service";

@Controller('monthly-hours')
export class MonthlyHoursController {
    constructor(private readonly monthlyHoursService: MonthlyHoursService) {}

    @UseGuards(AuthJWTGuard,RolesGuard)
    @Roles(Role.Admin)
    @Post('findByUserIdAndDate')
    async findByUserIdAndDate(@Body() body: { inputDate: string, userId: number }) {
        const { inputDate, userId } = body;
        const date = new Date(inputDate);
        const data = {date, userId};
        return this.monthlyHoursService.findByUserIdAndDate(data);
    }

    @UseGuards(AuthJWTGuard,RolesGuard)
    @Roles(Role.Admin)
    @Post('compareUsersAttendance')
    async compareUsersAttendance(@Body() body: { inputDate: string, firstUserId: number, secondUserId: number }) {
        const { inputDate, firstUserId, secondUserId } = body;
        const date = new Date(inputDate);
        const data = {date, firstUserId, secondUserId};
        return this.monthlyHoursService.compareAttendance(data);
    }

}