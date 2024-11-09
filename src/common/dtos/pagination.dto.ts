import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto {

  @ApiProperty({
    example: 5,
    default: 10,
    description: 'Number of rows you want to show'
  })
  @IsOptional()
  @IsPositive()
  @Type( () => Number ) // enableImplicitConversions: true
  limit?: number; 

  @ApiProperty({
    example: 2,
    default: 0,
    minimum: 0,
    description: 'The number of results you want to skip'
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type( () => Number ) // enableImplicitConversions: true
  offset?: number;
}