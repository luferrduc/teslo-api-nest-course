import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PostgresExceptionHandler],
  imports: [
    TypeOrmModule.forFeature([
      User
    ])
  ],
  exports: [TypeOrmModule]
})
export class AuthModule {}
