import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity';
import { CreateUserDto, LoginUserDto} from './dto';
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';
import { JwtPayload } from './interfaces/jwt-payload.interface';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    
    private readonly postgresExceptionHandler: PostgresExceptionHandler,

    private readonly jwtService: JwtService
  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto 

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      
      delete user.password
      // TODO: retornar JWT
      return {
        ...user,
        // token: this.getJwtToken({ email: user.email })
        token: this.getJwtToken({ id: user.id })
      };
  
    } catch (error) {
      this.postgresExceptionHandler.handlerDBExceptions(error)
    }
  }

  async login(loginUserDto: LoginUserDto){  
    const { password, email } = loginUserDto

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: {
        email: true,
        password: true,
        id: true
      }
    })

    if(!user)
      throw new UnauthorizedException('Invalid credentials') 
    const isValidPassword = bcrypt.compareSync(password, user.password)

    if(!isValidPassword)
      throw new UnauthorizedException('Invalid credentials')

    // TODO: retornar JWT
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  async checkAuthStatus(user: User){

    const {email, fullName, id, password } = user

    const newToken = this.getJwtToken({ id })

    return {
      id,
      email,
      fullName,
      password,
      token: newToken
    }
  }

  private getJwtToken (payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token

  }

}
