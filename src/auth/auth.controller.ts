import { IncomingHttpHeaders } from 'http';
import { Controller, Get, Post, Body, HttpCode, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';

import { CreateUserDto, LoginUserDto } from "./dto/";
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { Auth, GetUser, RawHeaders, RoleProtected  } from './decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  loginUser(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto)
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(
    // TODO: algo
    @GetUser() user: User
  ){
     return this.authService.checkAuthStatus(user)
  }

  @Get('private')
  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders
  ) {

    return {
      ok: true,
      message: 'Ruta PRIVADA',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }


  @Get('private2')
  @ApiExcludeEndpoint()
  @SetMetadata('roles', ['admin', 'super-user']) // Añadir info extra al método o controlador
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user: User
  ){
    
   return {
    ok: true,
    user
   } 
  }

  @Get('private3')
  @ApiExcludeEndpoint()
  // @RoleProtected(ValidRoles.admin, ValidRoles.superUser) --> Forma con el ENUM
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(
    @GetUser() user: User
  ){
    
   return {
    ok: true,
    user
   } 
  }


  @Get('private4')
  @ApiExcludeEndpoint()
  // @Auth() // Para cualquiera
  // @Auth(ValidRoles.admin) --> Forma con el ENUM
  @Auth('admin', 'super-user')
  privateRoute4(
    @GetUser() user: User
  ){
    
   return {
    ok: true,
    user
   } 
  }

}
