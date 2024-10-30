import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { Product } from './entities/product.entity';
import { validate as isUUID } from 'uuid'
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){} 

  async create(createProductDto: CreateProductDto) {
    try {
      // Crea la instancia del producto con sus propiedades
      const product = this.productRepository.create(createProductDto)

      await this.productRepository.save(product)
      
      return product
      
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      // TODO: relations
    })
    return products;
  }

  async findOne(term: string) {
    let product: Product;

    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      product = await this.productRepository.findOneBy({ slug: term })
    } 
    // const product = await this.productRepository.findOneBy({ term })
    if(!product)
      throw new NotFoundException(`Product with id, slug '${term}' not found`)

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    // await this.productRepository.delete(id) -> otra forma
    await this.productRepository.remove(product)
    return;
  }


  private handleDbExceptions(error: any){
    this.logger.error(error)
    if(error.code === '23505')
      throw new BadRequestException(error.detail)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
