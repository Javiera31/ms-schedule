import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateScheduleEntryDto {

    @IsNotEmpty()
    @IsString()
    readonly date: Date;
  
    @IsNotEmpty()
    @IsString()
    readonly entered: string;
}
