import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateScheduleDto {

    @IsNotEmpty()
    @IsNumber()
    readonly id: number;

    @IsNotEmpty()
    readonly date: Date;
  
    @IsNotEmpty()
    @IsString()
    readonly entered: string;
  
    @IsString()
    readonly left: string;//verificar que si tiene antes de editar left, entonces no puede quedar nulo, solo se puede cambiar
}
