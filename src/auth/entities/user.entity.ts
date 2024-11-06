
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

}
