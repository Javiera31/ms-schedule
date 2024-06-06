import { PartialType } from '@nestjs/mapped-types';
import { CreateScheduleEntryDto } from './createScheduleEntry.dto';

export class UpdateScheduleDto extends PartialType(CreateScheduleEntryDto) {}
