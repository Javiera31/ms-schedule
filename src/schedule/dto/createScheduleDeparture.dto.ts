import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateScheduleDepartureDto {

    @IsNotEmpty()
    @IsString()
    readonly date: Date;
  
    @IsString()
    @IsNotEmpty()
    readonly left: string;

    @IsNotEmpty()
    @IsString()
    leftLocation: string; //verificar que sea latitud/longitud/altitud
}