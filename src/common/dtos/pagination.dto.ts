import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

  @IsOptional()
  @IsPositive()
  @Type( () => Number ) // enableImplicitConversions: true
  limit?: number; 

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type( () => Number ) // enableImplicitConversions: true
  offset?: number;
}