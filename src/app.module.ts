import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import baseConfig from './config/baseConfig';
import { Schedule } from './schedule/entities/schedule.entity';
import { ScheduleController } from './schedule/schedule.controller';
import { ScheduleService } from './schedule/schedule.service';
import { HttpModule } from '@nestjs/axios';
import { CronJobController } from './cronJob/cronJob.controller';
import { CronJobService } from './cronJob/cronJob.service';
import { WeeklyHoursService } from './weeklyHours/weeklyHours.service';
import { MonthlyHoursService } from './monthlyHours/monthlyHours.service';
import { MonthlyHours } from './monthlyHours/entities/monthlyHours.entity';
import { WeeklyHours } from './weeklyHours/entities/weeklyHours.entity';
import { WeeklyHoursModule } from './weeklyHours/weeklyHours.module';
import { MonthlyHoursModule } from './monthlyHours/monthlyHours.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [baseConfig],
  }),
  JwtModule.registerAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      };
    },
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      return {
        type: 'mysql',
        host: configService.get<string>('DATABASE_HOST') as string,
        port: configService.get<number>('DATABASE_PORT') as number,
        username: configService.get<string>('DATABASE_USER') as string,
        password: configService.get<string>('DATABASE_PASSWORD') as string,
        database: configService.get<string>('DATABASE_NAME') as string,
        synchronize: configService.get<string>('DATABASE_SYNC') === 'true',
        ssl: false,
        entities: [Schedule,WeeklyHours,MonthlyHours],
      };
    },
  }),
  TypeOrmModule.forFeature([Schedule, Repository,WeeklyHours,MonthlyHours]),
  ScheduleModule,
  WeeklyHoursModule,
  MonthlyHoursModule,
  HttpModule, //agregamos httpmodule
],
  controllers: [AppController,ScheduleController,CronJobController],
  providers: [AppService,ScheduleService,Schedule,Repository,CronJobService,WeeklyHoursService,MonthlyHoursService],
})
export class AppModule {}
