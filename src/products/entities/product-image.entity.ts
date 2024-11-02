import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";


@Entity({ name: 'product_images' })
export class ProductImage {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    product => product.images,
    { // Al eliminar Producto, esta entidad se verá afectada en cascada
      // Es decir, también serán eliminados todos los registros que tengan
      // relación con dicho Producto
      onDelete: 'CASCADE'
    }
  )
  product: Product

}