import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeeklyHours } from "./entities/weeklyHours.entity";
import { weeklyHoursDayDto } from "./dto/weeklyHoursDayDto.dto";
import { getDayOfWeek } from "src/schedule/utils/getDatesOfWeek";
import { findByUserIdAndDateDto } from "./dto/findByUserIdAndDateDto.dto";

@Injectable()
export class WeeklyHoursService {
  constructor(
    @InjectRepository(WeeklyHours)
    private readonly weeklyHoursRepository: Repository<WeeklyHours>,
  ) {}

  async findAll(): Promise<WeeklyHours[]> {
    return await this.weeklyHoursRepository.find();
  }
  
  async createWeeklyHours(weeklyHoursData: weeklyHoursDayDto): Promise<WeeklyHours> {
    const { userId, weekStart, hoursWorked } = weeklyHoursData;
    
    
    console.log('weeklyHoursData.weekStart:', weeklyHoursData.weekStart)

    const existingRecord = await this.weeklyHoursRepository.findOne({
      where: {
        userId: weeklyHoursData.userId,
        weekStart: (weeklyHoursData.weekStart),
      },
    });


    let day;
    let hours;

    for (const dayDate in hoursWorked) {
      if (Object.prototype.hasOwnProperty.call(hoursWorked, dayDate)) {
        const hoursDay = hoursWorked[dayDate];
        console.log(`en createWeeklyHours: User ID: ${userId}, Week Start: ${weekStart}, Date: ${dayDate}, Hours: ${hoursDay}`);
        day = (dayDate);
        hours = hoursDay;
      }
    }

    const dayName = getDayOfWeek(new Date(day));
    //Si existe, agregar en la columna que tiene el nombre del dia encontrado en el paso anterior el valor json dateHour
    if (existingRecord) {
      console.log('NO ENTRA ACA')
      // Si existe, agregar en la columna correspondiente al día el valor nuevo sin sobrescribir los datos existentes
      if (existingRecord[dayName]) {
        existingRecord[dayName][day] = hours;
      } else {
        existingRecord[dayName] = { [day]: hours };
      }
      console.log('existingRecord es: ', existingRecord);
      return this.weeklyHoursRepository.save(existingRecord);
    } else {
      // Si no existe, crear un nuevo registro
      const newWeeklyHours = new WeeklyHours();
      newWeeklyHours.userId = userId;

      // Obtener el dia siguiente al primer dia de la semana
      // La fecha se obtenia bien pero al almacenar base de datos quedaba el dia anterior
      const nextDay = weekStart.getTime() + 24 * 60 * 60 * 1000;
      newWeeklyHours.weekStart = new Date(nextDay);

      console.log('userId: ', userId,'newWeeklyHours.weekStart: ',newWeeklyHours.weekStart)
      // Asignar las horas trabajadas al día correspondiente
      newWeeklyHours[dayName] = { [day]: hours };
      console.log('el weekStart segundo es: ',newWeeklyHours.weekStart)
      return this.weeklyHoursRepository.save(newWeeklyHours);
    }
  }

  async findByUserIdAndDate(findWeeklyHoursDto: findByUserIdAndDateDto): Promise<(number | null)[]> {
    const { date, userId } = findWeeklyHoursDto;
    
    const existingRecords = await this.weeklyHoursRepository.findBy( { userId: userId, weekStart: date } );

    if (existingRecords.length === 0) {
      console.log('no lo encuentra:(')
      console.log('existingRecords')
      return [null, null, null, null, null, null, null];
    }

    const existingRecord = existingRecords[0];
    return [
      existingRecord.monday ? Object.values(existingRecord.monday)[0] : null,
      existingRecord.tuesday ? Object.values(existingRecord.tuesday)[0] : null,
      existingRecord.wednesday ? Object.values(existingRecord.wednesday)[0] : null,
      existingRecord.thursday ? Object.values(existingRecord.thursday)[0] : null,
      existingRecord.friday ? Object.values(existingRecord.friday)[0] : null,
      existingRecord.saturday ? Object.values(existingRecord.saturday)[0] : null,
      existingRecord.sunday ? Object.values(existingRecord.sunday)[0] : null,
    ];
  }

  async compareAttendance(data: { date: Date, firstUserId: number, secondUserId: number }){
    const { date, firstUserId, secondUserId } = data;
    const firsUserData = { date, firstUserId };
    const secondUserData = { date, secondUserId };
    const firstUser = this.findByUserIdAndDate({ date: date, userId: firstUserId});
    const secondUser = this.findByUserIdAndDate({ date: date, userId: secondUserId});

    return [firstUser, secondUser];
  }

  async deleteAll(): Promise<void> {
    await this.weeklyHoursRepository.clear();
  }

  /*async findByUserIdAndWeekStart(userId: number, weekStart: string): Promise<WeeklyHours> {
    return this.weeklyHoursRepository.findOne({ where: { userId, weekStart } });
  }*/

}