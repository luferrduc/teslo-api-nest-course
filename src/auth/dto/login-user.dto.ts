import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";


export class LoginUserDto {

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
    required: true
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
      /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
      message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

}