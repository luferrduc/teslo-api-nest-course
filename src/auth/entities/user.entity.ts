
import { Product } from "@/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  email: string;

  @Column('text', {
    select: false
  })
  password: string;

  @Column('text', {
    name: 'full_name'
  })
  fullName: string;

  @Column('bool', {
    name: 'is_active',
    default: true
  })
  isActive: boolean

  @Column('text', {
    array: true,
    default: ['user']
  })
  roles: string[]


  @OneToMany(
    () => Product,
    product => product.user,
    {
      cascade: true
    }
  )
  products?: Product[]


  @BeforeInsert()
  checkFieldsBeforeInsert(){
    this.email = this.email.trim().toLowerCase();
  }

  @BeforeUpdate()
  checkFieldsBeforeUptade(){
    this.checkFieldsBeforeInsert()
  }

}
