import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

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
  @ApiBearerAuth('token')
  @ApiResponse({ status: 201, description: 'Product was created', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request'})
  @ApiResponse({ status: 401, description: 'Unauthorized', example: { statusCode: 401, message: 'Unauthorized' }})
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User
  ) {
    return this.productsService.create(createProductDto, user);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'List of products', type:  [Product] })
  findAll( @Query() paginationDto: PaginationDto) {
    return this.productsService.findAll(paginationDto);
  }

  @Get(':term')
  @ApiResponse({status: 200, description: 'Product found', type: Product })
  findOne(@Param('term') term: string) {
    return this.productsService.findOnePlain(term);
  }

  @Patch(':id')
  // @Auth(ValidRoles.admin) --> Forma con el ENUM
  @Auth('admin')
  @ApiBearerAuth('token')
  @ApiResponse({ status: 200, description: 'List of products', type:  Product })
  @ApiResponse({ status: 401, description: 'Unauthorized', example: { statusCode: 401, message: 'Unauthorized' }})
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
  @ApiBearerAuth('token')
  @ApiResponse({status: 200, description: 'Product deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized', example: { statusCode: 401, message: 'Unauthorized' }})
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
