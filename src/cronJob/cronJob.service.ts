import { Injectable } from "@nestjs/common";
import { ScheduleService } from "../schedule/schedule.service";
import { WeeklyHoursService } from "src/weeklyHours/weeklyHours.service";
import { MonthlyHoursService } from "src/monthlyHours/monthlyHours.service";
import { Cron, CronExpression } from "@nestjs/schedule";
import { calculateWeeklyHours } from "./utils/datesHours";


@Injectable()
export class CronJobService {
    constructor(
    private readonly weeklyHoursService: WeeklyHoursService,
    private readonly monthlyWorkHoursService: MonthlyHoursService,
    private readonly scheduleService: ScheduleService,
  ) {}

  //@Cron('0 21 * * *')
  async updateWeeklyHours() {
    const schedules = await this.scheduleService.findAll();
    // Calcula las horas trabajadas semanalmente a partir de los registros obtenidos.
    const weeklyHoursMap = calculateWeeklyHours(schedules);
    await this.weeklyHoursService.deleteAll();

    // Itera sobre cada entrada en el mapa de horas trabajadas semanales.
    for (const [user, weeklyWorkHours] of weeklyHoursMap.entries()) {
      for (const weekStart in weeklyWorkHours) {
        await this.weeklyHoursService.createWeeklyHours({
          userId: +user,
          weekStart: new Date(weekStart),//string de la forma yyyy-mm-dd
          hoursWorked: weeklyWorkHours[weekStart],
        });
      }
    }
  }

  //@Cron('0 22 * * *')
  async updateMonthlyHours(){
    this.monthlyWorkHoursService.createMonthlyHours();
  }

}
