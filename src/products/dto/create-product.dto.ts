import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";


export class CreateProductDto {

  @ApiProperty({
    example: 'Men\'s Pikachu T-shirt',
    description: 'Product Title',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(2)
  title: string;

  @ApiProperty({
    example: 100.99,
    description: 'Product price',
    nullable: true,
    default: 0
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 'Designed to pokemon fans in collaboration with The Pokémon Company',
    description: 'Product description',
    nullable: true
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'mens_pikachu_t-shirt',
    description: 'Product Slug. Product title optimized to use in urls and SEO',
    nullable: true
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({
    example: 15,
    description: 'Product stock',
    nullable: true,
    default: 0
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ["XS","S","M"],
    description: 'List of product\'s sizes',
    nullable: false
  })
  @IsString({ each: true })
  @IsArray()
  sizes: string[];

  @ApiProperty({
    example: 'men',
    description: 'Product gender',
    nullable: false,
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @IsIn(['men', 'women', 'kid', 'unisex'])
  gender: string;

  @ApiProperty({
    example: ["Pokemon", "Anime", "Japan"],
    description: 'List of products tags',
    nullable: false
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  tags: string[];


  @ApiProperty({
    example: ['pikachu_1929_M_men.png', 'pikachu_1309_XL_men.png'],
    description: 'List of product\'s images',
    nullable: true,
    isArray: true,
    default: []
  })
  @IsString({ each: true })
  @IsArray()
  @IsOptional()
  images?: string[]

}
