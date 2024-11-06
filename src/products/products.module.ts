import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities'
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, PostgresExceptionHandler],
  imports: [
    TypeOrmModule.forFeature([
      Product,
      ProductImage
    ])
  ],
  exports: [
    ProductsService,
    // Si quiero que otro móodulo o servicio
    // tenga acceso y pueda ocupar las entidades de Product
    TypeOrmModule
  ]
})
export class ProductsModule {}
