import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class CreateUserDto {

  @ApiProperty({
    example: 'persona1@gmail.com',
    nullable: false,
    required: true
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '56hAmndhY698',
    nullable: false,
    required: true,
    minLength: 6,
    maxLength: 50
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    nullable: false,
    required: true,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  fullName: string;

}