import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class findByUserIdAndDateDto{
    @IsString()
    @IsNotEmpty()
    date: Date 
    
    @IsNumber()
    @IsNotEmpty()
    userId: number 
}

