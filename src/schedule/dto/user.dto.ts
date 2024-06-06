import { IsBoolean, IsNotEmpty, IsNumber } from "class-validator";

export class userDto {

    @IsNotEmpty()
    @IsNumber()
    id: number;
    
    @IsNotEmpty()
    @IsBoolean()
    role: boolean;
}