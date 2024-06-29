import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { CreateScheduleEntryDto } from './dto/createScheduleEntry.dto';
import { CreateScheduleDepartureDto } from './dto/createScheduleDeparture.dto';
import { userDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { In, Not, Repository } from 'typeorm';
import { getDatesInRange, getDatesOfWeek, getSundayOfWeek, isLastWeek } from './utils/getDatesOfWeek';
import { dateRangeDto } from './dto/dateRangeDto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) { }

  async createEntry(user: number, createScheduleDto: CreateScheduleEntryDto) {
    //buscar en repositorio si hay una tupla que tenga el id del usuario en idUser(number) y la misma fecha con date. Si es así decir que no se puede crear
    const existingEntry = await this.scheduleRepository.findOne({
      where: {
        idUser: user,
        date: createScheduleDto.date
      }
    });

    if (existingEntry) {
      throw new BadRequestException('Ya existe una entrada marcada para hoy');
    }

    //si es que se puede crear, crearla y guardar los valores en la base de datos
    const newEntry = this.scheduleRepository.create({
      idUser: user,
      date: createScheduleDto.date,
      entered: createScheduleDto.entered,
      enteredLocation: createScheduleDto.enteredLocation
    });

    // Guardar la nueva entrada en la base de datos
    await this.scheduleRepository.save(newEntry);
    const fecha = await this.scheduleRepository.findOne({
      where: {
        idUser: user,
        date: createScheduleDto.date
      }
    });
    return newEntry;
  }

  async createDeparture(user: number,createScheduleDto: CreateScheduleDepartureDto) {
    const newExit = await this.scheduleRepository.findOne({
      where: {
        idUser: user,
        date: createScheduleDto.date,
      },
    });

    if (!newExit) {
      throw new BadRequestException(
        'Se requiere una entrada para marcar salida.',
      );
    }

    if (newExit.left) {
      throw new BadRequestException(
        'Ya existe una salida marcada',
      );
    }

    // Actualizar la entrada existente con la hora de salida
    newExit.left = createScheduleDto.left;
    newExit.leftLocation = createScheduleDto.leftLocation;
    // Guardar la actualización en la base de datos
    await this.scheduleRepository.save(newExit);

    // Retornar la entrada actualizada
    return newExit;
  }

  async findWeek(user: number,inputDate: Date){
    // Ver si la fecha ingresada es de una semana anterior a la semana del día de hoy
    if(isLastWeek(inputDate)){
      const sundayOfLastWeek = getSundayOfWeek(inputDate);
      console.log("sundayOfLastWeek ",sundayOfLastWeek)
      const attendance = await this.getWeekAttendance(user,sundayOfLastWeek);
      return attendance;
    }
    // En caso de que fecha sea hoy o esta semana
    const attendance = await this.getWeekAttendance(user,inputDate);
    return attendance;
  }
  
  async findRange(user: number,inputDate: dateRangeDto){
    const startDate = new Date(inputDate.startDate);
    const endDate = new Date(inputDate.endDate);

    // obtener fechas
    const dateRange = await getDatesInRange(startDate,endDate);
    

    const dateFound = await this.scheduleRepository.find({
      where: {
        idUser: user,
        date: In(dateRange),
      },
    });

    const data = {};
    dateFound.forEach(entry => {
      data[entry.id] = {
        date: entry.date,
        entered: entry.entered,
        left: entry.left,
      };
    });
    return data;
  }

  async getWeekAttendance(user: number,inputDate: Date){
    const weekDates = getDatesOfWeek(inputDate);

    //buscar en repository el id y las date que sean igual a la del request y de la fecha ingresada
    const schedules = await this.scheduleRepository.find({
      where: {
        idUser: user,
        date: In(weekDates), //no me está incluyendo el buscar la fecha actual
      },
    });

    //retornar un json con las que tengan los dos parámetros (id,date) iguales que los datos ingresados y el json muestre la hora de entrada y salida por date
    const data = {};
    schedules.forEach(entry => {
      data[entry.id] = {
        date: entry.date,
        entered: entry.entered,
        left: entry.left,
      };
    });
    return data;
  }

  async findAll(): Promise<Schedule[]> {
    return await this.scheduleRepository.find();
  }

  async findScheduleById(id: number): Promise<Schedule> {
    try {
      const schedule = await this.scheduleRepository.findOneBy({
        id: id,
      });
      if (!schedule) {
        throw new Error('Horario no encontrado');
      }
      return schedule;
    } catch (error) {
      return error;
    }
  }

  async update(user: number,updateScheduleDto: UpdateScheduleDto) {
    const schedule = await this.findScheduleById(updateScheduleDto.id!);
    if (!schedule) {
      throw new Error('Horario no encontrado');
    }
    const existingEntry = await this.scheduleRepository.findOne({//fecha se cambió a una existente
      where: {
        date: updateScheduleDto.date,
        idUser: user,
        id: Not(updateScheduleDto.id),
      }
    });
    if(existingEntry){
      throw new Error('Ya existe un horario existente en la fecha');
    }

    const updatedSchedule = new Schedule();
    updatedSchedule.id = updateScheduleDto.id;
    updatedSchedule.date = updateScheduleDto.date;
    updatedSchedule.entered = updateScheduleDto.entered;
    updatedSchedule.left = updateScheduleDto.left;
    updatedSchedule.idUser = schedule.idUser;
    updatedSchedule.enteredLocation = schedule.enteredLocation;
    updatedSchedule.leftLocation = schedule.leftLocation;
    updatedSchedule.editedByAdmin = true;

    return await this.scheduleRepository.save(updatedSchedule);
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }

}
