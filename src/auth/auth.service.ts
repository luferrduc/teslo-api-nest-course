import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User) 
    private readonly userRepository: Repository<User>,
    
    private readonly postgresExceptionHandler: PostgresExceptionHandler
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
      return user
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
        password: true
      }
    })

    if(!user)
      throw new UnauthorizedException('Invalid credentials') 
    const isValidPassword = bcrypt.compareSync(password, user.password)

    if(!isValidPassword)
      throw new UnauthorizedException('Invalid credentials')

    // TODO: retornar JWT
    return 'logged in';

  }

}
