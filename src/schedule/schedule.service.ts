import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateScheduleDto } from './dto/updateSchedule.dto';
import { CreateScheduleEntryDto } from './dto/createScheduleEntry.dto';
import { CreateScheduleDepartureDto } from './dto/createScheduleDeparture.dto';
import { userDto } from './dto/user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { In, Repository } from 'typeorm';
import { getDatesOfWeek } from './utils/getDatesOfWeek';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>
  ) { }

  async createEntry(user: userDto, createScheduleDto: CreateScheduleEntryDto) {
    //buscar en repositorio si hay una tupla que tenga el id del usuario en idUser(number) y la misma fecha con date. Si es así decir que no se puede crear
    const existingEntry = await this.scheduleRepository.findOne({
      where: {
        idUser: user.id,
        date: createScheduleDto.date
      }
    });

    if (existingEntry) {
      throw new BadRequestException('Entry for this user on this date already exists');
    }

    //si es que se puede crear, crearla y guardar los valores en la base de datos
    const newEntry = this.scheduleRepository.create({
      idUser: user.id,
      date: createScheduleDto.date,
      entered: createScheduleDto.entered
    });

    // Guardar la nueva entrada en la base de datos
    await this.scheduleRepository.save(newEntry);
    const fecha = await this.scheduleRepository.findOne({
      where: {
        idUser: user.id,
        date: createScheduleDto.date
      }
    });
    console.log(fecha.date);
    //createScheduleDto = { idUser: number, date: Date, entry: string correponde a hora }
    return newEntry;
  }

  createDeparture(createScheduleDto: CreateScheduleDepartureDto) {
    //buscar en repositorio si hay una tupla que tenga el id del usuario en idUser(number), la misma fecha con date, ver si tiene un valor en entered y que no tenga valor left. Si left tiene valor decir que no se puede crear. Si entered no tiene valor decir que no se ha guardado la entrada aun (no se crea salida)
    return 'This action adds a new schedule entry';
  }

  async findWeek(user: userDto,inputDate: Date){
    //request.user = { id: userId, role: userRole };
    //obtener las fechas de los días de la semana con la función hecha
    const weekDates = getDatesOfWeek(inputDate);
    console.log("???")
    console.log(user)

    //buscar en repository el id y las date que sean igual a la del request y de la fecha ingresada
    const schedules = await this.scheduleRepository.find({
      where: {
        idUser: user.id,
        date: In(weekDates.map(date => new Date(date))),
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

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto) {
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
