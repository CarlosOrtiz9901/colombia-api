import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { department } from './department';

@Entity('municipality')
export class municipality {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('character varying', { nullable: true, length: 255 })
  name: string | null;

  @Column('character varying', { nullable: true, length: 100, unique: true })
  key: string | null;

  @Column('character varying', { nullable: true, length: 10, default: 'active' })
  state: string | null;

  @ManyToOne(type => department, department => department.municipalitys, { nullable: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'fk_department', referencedColumnName: 'key' })
  department: department;

}
