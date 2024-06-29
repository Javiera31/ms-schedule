import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MonthlyHours } from "./entities/monthlyHours.entity";
import { Repository } from "typeorm";
import { WeeklyHoursService } from "src/weeklyHours/weeklyHours.service";
import { WeeklyHours } from "src/weeklyHours/entities/weeklyHours.entity";
import { findByUserIdAndDateDto } from "src/weeklyHours/dto/findByUserIdAndDateDto.dto";

@Injectable()
export class MonthlyHoursService {
  constructor(
    @InjectRepository(MonthlyHours)
    private readonly monthlyHoursRepository: Repository<MonthlyHours>,
    private readonly weeklyHoursService: WeeklyHoursService
  ) {}

  compareAttendance(data: { date: Date; firstUserId: number; secondUserId: number; }) {
    const { date, firstUserId, secondUserId } = data;
    const firsUserData = { date, firstUserId };
    const secondUserData = { date, secondUserId };
    const firstUser = this.findByUserIdAndDate({ date: date, userId: firstUserId});
    const secondUser = this.findByUserIdAndDate({ date: date, userId: secondUserId});

    return [firstUser, secondUser];
  }

  //cambiar la lógica de esto
  async findByUserIdAndDate(findWeeklyHoursDto: findByUserIdAndDateDto): Promise<(number | null)[]> {
    //para un usuario y el año obtenido de la fecha en findWeeklyHoursDto
    const { date, userId } = findWeeklyHoursDto;
    const yearValue = date.getUTCFullYear();;
    const existingRecords = await this.monthlyHoursRepository.find({ where: { userId: userId, year: yearValue } });

    if (existingRecords.length === 0) {
      console.log('no lo encuentra:(')
      console.log('existingRecords')
      return Array(12).fill(null); //[null, null, null, null, null, null, null,null,null,null,null,null];
    }

    const monthlyTotals = Array(12).fill(null);
    //recorrer existingRecords y agregar el valor monthlyTotal en la posicion numero month de la lista
    existingRecords.forEach(record => {
      const monthIndex = record.month - 1; // Los índices de los meses en la lista (0-11)
      monthlyTotals[monthIndex] = record.monthlyTotal;
    });

    return monthlyTotals;
    
  }

  async createMonthlyHours() {
    const weeklyHours = await this.weeklyHoursService.findAll();
    const annualDataMap = this.aggregateWeeklyHoursToAnnualData(weeklyHours);

    for (const [key, value] of annualDataMap.entries()) {
      const [userId, year, month] = key.split('-').map(Number);
      const averageHours = value.totalHours / value.workDays;

      let annualData = await this.monthlyHoursRepository.findOne({ where: { userId, year, month } });
      if (!annualData) {
        annualData = new MonthlyHours();
        annualData.userId = userId;
        annualData.year = year;
        annualData.month = month;
      }

      annualData.monthlyTotal = averageHours;
      await this.monthlyHoursRepository.save(annualData);
    }
    /*const monthlyHours = await this.monthlyHoursRepository.findOne({ where: { userId: data.userId, year: data.year, month: data.month } });
    
    if (monthlyHours) {
      return { error: 'Failed to update monthly work hours'};
    } else {
      const newMonthlyHours = this.monthlyHoursRepository.create(data);
      await this.monthlyHoursRepository.save(newMonthlyHours);
    }*/

  }

  private aggregateWeeklyHoursToAnnualData(weeklyHours: WeeklyHours[]): Map<string, { totalHours: number, workDays: number }> {
    const annualDataMap = new Map<string, { totalHours: number, workDays: number }>();

    for (const weekly of weeklyHours) {
      const { userId, weekStart, monday, tuesday, wednesday, thursday, friday } = weekly;
      const weekStartDate = new Date(weekStart);
      const year = weekStartDate.getFullYear();

      const days = [monday, tuesday, wednesday, thursday, friday];
      for (const day of days) {
        if (day) {
          for (const date in day) {
            const dateObj = new Date(date);
            const month = dateObj.getMonth() + 1; // getMonth() returns 0-11
            const hours = day[date];

            const key = `${userId}-${year}-${month}`;
            if (!annualDataMap.has(key)) {
              annualDataMap.set(key, { totalHours: 0, workDays: 0 });
            }

            const data = annualDataMap.get(key);
            data.totalHours += hours;
            data.workDays += 1;
          }
        }
      }
    }

    return annualDataMap;
  }

}