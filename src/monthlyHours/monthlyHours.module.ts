import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { MonthlyHoursService } from "./monthlyHours.service";
import { WeeklyHoursModule } from "src/weeklyHours/weeklyHours.module";
import { MonthlyHours } from "./entities/monthlyHours.entity";
import { MonthlyHoursController } from "./monthlyHours.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
    imports: [TypeOrmModule.forFeature([MonthlyHours]),Repository,WeeklyHoursModule,HttpModule],
    controllers: [MonthlyHoursController],
    providers: [MonthlyHoursService, Repository],
    exports: [MonthlyHoursService],
  })
  export class MonthlyHoursModule {}