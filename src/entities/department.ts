import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { municipality } from './municipality';

@Entity('department')
export class department {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column('character varying', { nullable: true, length: 255 })
  name: string | null;

  @Column('character varying', { nullable: true, length: 100, unique: true })
  key: string | null;

  @Column('character varying', { nullable: true, length: 10, default: 'active' })
  state: string | null;

  @OneToMany(type => municipality, municipality => municipality.department)
  municipalitys: municipality[];

}
