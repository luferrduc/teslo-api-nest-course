import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';
import { validate as isUUID } from 'uuid'
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>
  ){} 

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto
      // Crea la instancia del producto con sus propiedades
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      })

      await this.productRepository.save(product)
      
      return { ...product, images }
      
    } catch (error) {
      this.handleDbExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    })
    return products.map( product => ({
      ...product,
      images: product.images.map( ({url}) => url )
    }));
  }

  async findOne(term: string) {
    let product: Product;

    if( isUUID(term) ){
      product = await this.productRepository.findOneBy({ id: term })
    } else {
      // product = await this.productRepository.findOneBy({ slug: term })
      const queryBuilder = this.productRepository.createQueryBuilder('prod')
      product = await queryBuilder.where('LOWER(title) =:title OR LOWER(slug) =:slug', {
        title: term.toLowerCase(),
        slug: term.toLowerCase()
      })
      .leftJoinAndSelect('prod.images', 'prodImages')
      .getOne()
    } 
    if(!product)
      throw new NotFoundException(`Product with id, slug '${term}' not found`)

    return product;
  }

  async findOnePlain(term: string){ 
    const product = await this.findOne(term)
    return {
      ...product,
      images: product.images.map( img => img.url)  
    }
  }


  async update(id: string, updateProductDto: UpdateProductDto) {
    
    // Lo prepara para la actualización (no actualiza directamente)
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
      images: []
    })

    if(!product) 
      throw new NotFoundException(`Product with id '${id}' not found`)
    try {
      await this.productRepository.save(product)
      return product;
    } catch (error) {
      this.handleDbExceptions(error)
    }
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
