import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class dateRangeDto {

    @IsNotEmpty()
    @IsString()
    readonly startDate: Date;
  
    @IsString()
    @IsNotEmpty()
    readonly endDate: Date;
}