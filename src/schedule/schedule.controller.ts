import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { AuthJWTGuard } from './guards/authJWT.guard';
import { CreateScheduleEntryDto } from './dto/createScheduleEntry.dto';
import { CreateScheduleDepartureDto } from './dto/createScheduleDeparture.dto';
import { dateRangeDto } from './dto/dateRangeDto';
import { Roles } from './decorators/roles.decorator';
import { Role } from './enums/role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  //request.user = { id: userId, role: userRole };
  @UseGuards(AuthJWTGuard)
  @Post('entry')
  createEntry(@Request() req, @Body() createScheduleDto: CreateScheduleEntryDto) {
    const user = req.user;//este es el resultado del guard
    return this.scheduleService.createEntry(user.id, createScheduleDto);
  }//verificar que la fecha sea de hoy

  @Post('departure')
  @UseGuards(AuthJWTGuard)
  createDeparture(@Request() req, @Body() createScheduleDto: CreateScheduleDepartureDto) {
    const user = req.user;
    return this.scheduleService.createDeparture(user.id, createScheduleDto);
  }

  @UseGuards(AuthJWTGuard)
  @Get()
  findWeek(@Request() req, @Body('inputDate') inputDate: string) {
    const user = req.user;
    const date = new Date(inputDate);
    console.log("en controller inputDate es ",inputDate)
    return this.scheduleService.findWeek(user.id, date); //acá retornar json
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @UseGuards(AuthJWTGuard)
  @Post()
  schedulesInRange(@Request() req, @Body('inputDate') inputDate: dateRangeDto) {
    const user = req.user;
    return this.scheduleService.findRange(user.id,inputDate);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    return this.scheduleService.update(+id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(+id);
  }

  @UseGuards(AuthJWTGuard)
  @Post('auth')
  isAdmin(@Request() req) {
    const user = req.user;
    return (user.role);
  }

  @UseGuards(AuthJWTGuard,RolesGuard)
  @Roles(Role.Admin)
  @Post('findUserWeek')
  findUserWeek(@Request() req, @Body() body: { inputDate: string, userFound: number }) {
    //const date = new Date(inputDate);
    const { inputDate, userFound } = body;
    const date = new Date(inputDate);
    console.log("date",date);
    if (isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    return this.scheduleService.findWeek(userFound, date); //acá retornar json
  }

  @UseGuards(AuthJWTGuard,RolesGuard)
  @Roles(Role.Admin)
  @Post('schedulesUserInRange')
  schedulesUserInRange(@Request() req, @Body() body: { inputDate: dateRangeDto, userFound: number}) {
    const { inputDate, userFound } = body;
    return this.scheduleService.findRange(userFound,inputDate);
  }

}
