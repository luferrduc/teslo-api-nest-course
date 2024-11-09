import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from "./product-image.entity";
import { User } from "@/auth/entities/user.entity";

@Entity({ name: 'products' })
export class Product {

  @ApiProperty({
    example: '333613fc-9ffa-43cb-9d83-ba2634adf558',
    description: 'Product ID',
    uniqueItems: true 
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Men\'s 3D Large Wordmark Tee',
    description: 'Product Title',
    uniqueItems: true 
  })
  @Column('text', {
    unique: true,
  })
  title: string;

  @ApiProperty({
    example: 100,
    description: 'Product Price',
    default: 0
  })
  @Column('float',{
    default: 0
  })
  price: number;


  @ApiProperty({
    example: 'Designed for fit, comfort and style, the Men\'s 3D Large Wordmark Tee is made from 100% Peruvian cotton with a 3D silicone-printed Tesla wordmark printed across the chest.',
    description: 'Product Description',
    nullable: true
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 'men_3d_large_wordmark_tee',
    description: 'Product Slug. Product title useful for SEO',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 10,
    description: 'Product\'s stock',
    default: 0
  })
  @Column('int', {
    default: 0
  })
  stock: number;


  @ApiProperty({
    example: ["XS","S","M"],
    description: 'List of product\'s sizes',
    isArray: true,
  })
  @Column('text', {
    array: true
  })
  sizes: string[];


  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @Column('text')
  gender: string;

  // tags
  @ApiProperty({
    example: 10,
    description: 'Product\'s tags',
    isArray: true,
    default: []
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[]

  // images
  @ApiProperty({
    example: ["8764734-00-A_0_2000.jpg", "8764734-00-A_1.jpg"],
    description: 'Product\'s images',
    isArray: true,
    default: []
  })
  @OneToMany(
    () => ProductImage,
    productImage => productImage.product,
    {
      cascade: true,
      eager: true
    }
  )
  images?: ProductImage[]
  
  // @ApiProperty({
  //   items: 
  // })
  @ManyToOne(
    () => User,
    user => user.products,
    {
      eager: true,
      onDelete: 'CASCADE'
    }
  )
  user: User

  @BeforeInsert()
  checkSlugInsert(){

    if(!this.slug){
      this.slug = this.title  
    }

    this.slug = this.slug      
                .toLowerCase()
                .replaceAll(' ', '_')
                .replaceAll("'",'')
  }

  @BeforeUpdate()
  checkSlugUpdate(){
    
    this.slug = this.slug      
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'",'')
  }

}
