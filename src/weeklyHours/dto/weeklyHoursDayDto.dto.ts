import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class weeklyHoursDayDto {

    @IsNotEmpty()
    @IsNumber()
    readonly userId: number;

    @IsNotEmpty()
    @IsString()
    weekStart: Date;

    @IsString()
    @IsNotEmpty()
    hoursWorked:  Record<string, number>;

}