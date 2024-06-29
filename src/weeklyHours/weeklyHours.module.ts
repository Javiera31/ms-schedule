import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WeeklyHoursService } from "./weeklyHours.service";
import { WeeklyHours } from "./entities/weeklyHours.entity";
import { WeeklyHoursController } from "./weeklyHours.controller";
import { HttpModule, HttpService } from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([WeeklyHours]),Repository,HttpModule],
    controllers: [WeeklyHoursController],
    providers: [WeeklyHoursService, Repository],
    exports: [WeeklyHoursService],
  })
export class WeeklyHoursModule {}
