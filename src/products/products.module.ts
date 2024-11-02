import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductImage } from './entities'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
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
