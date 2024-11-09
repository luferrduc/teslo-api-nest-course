import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { ValidRoles } from '@/auth/interfaces';
import { User } from '@/auth/entities/user.entity';
import { Product } from './entities';

@ApiTags('Products')
@Controller('products')
// @Auth()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  // @Auth(ValidRoles.user) --> Forma con el ENUM
  @Auth('user')
  @ApiResponse({status: 201, description: 'Product was created', type: Product })
  @ApiResponse({status: 400, description: 'Bad request'})
  @ApiResponse({status: 403, description: 'Forbidden. Token related.'})
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  // @ApiResponse({status: 200, description: 'List of products', type:  Array<Product> })
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  // @Auth(ValidRoles.admin) --> Forma con el ENUM
  @Auth('admin')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.update(id, updateProductDto, user);
  }

  @Delete(':id')
  // @Auth(ValidRoles.admin) --> Forma con el ENUM
  @Auth('admin')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
