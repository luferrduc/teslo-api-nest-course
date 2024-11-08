import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from '@/products/products.module';
import { AuthModule } from '@/auth/auth.module';
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';

@Module({
  controllers: [SeedController],
  providers: [SeedService, PostgresExceptionHandler],
  imports: [ProductsModule, AuthModule]
})
export class SeedModule {}
