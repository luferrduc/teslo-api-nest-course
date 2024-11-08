import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { Product, ProductImage } from './entities';
import { validate as isUUID } from 'uuid'
import { PostgresExceptionHandler } from '@/common/exceptions/db-handler.exceptions';
import { User } from '@/auth/entities/user.entity';
@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    
    private readonly dataSource: DataSource,

    private readonly postgresExceptionHandler: PostgresExceptionHandler
  ){} 

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto
      // Crea la instancia del producto con sus propiedades
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user: user
      })

      await this.productRepository.save(product)
      
      return { ...product, images }
      
    } catch (error) {
      this.postgresExceptionHandler.handlerDBExceptions(error)
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


  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
    
    const { images, ...toUpdate } = updateProductDto

    // Lo prepara para la actualización (no actualiza directamente)
    const product = await this.productRepository.preload({
      id,
      ...toUpdate
    })

    if(!product) 
      throw new NotFoundException(`Product with id '${id}' not found`)

    // Create query runner para realizar transacción
    // Requiere usar el commit explicitamente para guardar los cambios
    const queryRunner = this.dataSource.createQueryRunner(); 

    // Conectar a la BD
    await queryRunner.connect();
    await queryRunner.startTransaction();
    //* Todo lo que hagamos después de aquí con el queryRunner, serán parte de la transacción


    try {

      if( images ){
        // Se puede hacer de otras formas como por ejemplo
        //* await this.productRepository.delete(...) ...
        await queryRunner.manager.delete( ProductImage, {
          product: { id }
        })

        product.images = images.map( 
          image => this.productImageRepository.create({ url: image })
        ) 
      } else {
        // TODO
      }
      product.user = user;
      await queryRunner.manager.save(product)

      // await this.productRepository.save(product)
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.postgresExceptionHandler.handlerDBExceptions(error)
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    // await this.productRepository.delete(id) -> otra forma

    // Para eliminar un producto que tiene imagenes
    // se puede hacer iniciando una transacción, eliminar las
    // imagenes que están ligadas al producto y luego
    // eliminar el producto
    // También se puede eliminar el producto, haciendo
    // una eliminación en cascada (Cascade)    
    await this.productRepository.remove(product)
    return;
  }


  // private handleDbExceptions(error: any){
  //   this.logger.error(error)
  //   if(error.code === '23505')
  //     throw new BadRequestException(error.detail)
  //   throw new InternalServerErrorException('Unexpected error, check server logs')
  // }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product')
    try {
      return await query.delete()
                .where({})
                .execute()
    } catch (error) {
      this.postgresExceptionHandler.handlerDBExceptions(error)
    }
  }
}
