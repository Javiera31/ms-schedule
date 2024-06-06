import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateScheduleDepartureDto {

    @IsNumber()
    @IsNotEmpty()
    readonly idUser: number;

    @IsNotEmpty()
    readonly date: Date;
  
    @IsString()
    @IsNotEmpty()
    readonly left: string;
}