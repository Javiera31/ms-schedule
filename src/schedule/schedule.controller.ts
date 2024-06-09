import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { AuthJWTGuard } from './guards/authJWT.guard';
import { CreateScheduleEntryDto } from './dto/createScheduleEntry.dto';
import { CreateScheduleDepartureDto } from './dto/createScheduleDeparture.dto';
import { dateRangeDto } from './dto/dateRangeDto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  //request.user = { id: userId, role: userRole };
  @UseGuards(AuthJWTGuard)
  @Post('entry')
  createEntry(@Request() req, @Body() createScheduleDto: CreateScheduleEntryDto) {
    const user = req.user;
    return this.scheduleService.createEntry(user, createScheduleDto);
  }//verificar que la fecha sea de hoy

  @Post('departure')
  @UseGuards(AuthJWTGuard)
  createDeparture(@Request() req, @Body() createScheduleDto: CreateScheduleDepartureDto) {
    const user = req.user;
    return this.scheduleService.createDeparture(user, createScheduleDto);
  }

  @UseGuards(AuthJWTGuard)
  @Get()
  findWeek(@Request() req, @Body('inputDate') inputDate: string) {
    const user = req.user;
    const date = new Date(inputDate);
    console.log("en controller inputDate es ",inputDate)
    return this.scheduleService.findWeek(user, date); //acá retornar json
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
    return this.scheduleService.findRange(user,inputDate);
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

 /* @UseGuards(AuthJWTGuard)
  @Post('findUserWeek')
  findUserWeek(@Request() req, @Body() inputDate: string, userFound: number) {
    const user = req.user;
    if(!user.role){
      throw new BadRequestException('Unauthorized user');
    }
    const date = new Date(inputDate);
    return this.scheduleService.findWeekUser(userFound, date); //acá retornar json
  }*/

}
