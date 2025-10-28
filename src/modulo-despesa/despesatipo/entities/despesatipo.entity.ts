import {Column,CreateDateColumn,DeleteDateColumn,Entity,OneToMany,PrimaryGeneratedColumn,} from 'typeorm';
import { Despesa } from '../../despesa/entities/despesa.entity';

@Entity()
export class Despesatipo {
  @PrimaryGeneratedColumn({ name: 'despesatipo_id' })
  despesatipo_id: number;

  @Column({ name: 'despesatipo_descricao', type: 'varchar' })
  despesatipo_descricao: string;

  @CreateDateColumn({
    name: 'despesatipo_inclusao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  despesatipo_inclusao: Date;

  @DeleteDateColumn({
    name: 'despesatipo_exclusao',
    type: 'timestamp',
    nullable: true,
  })
  despesatipo_exclusao: Date;

  @OneToMany(() => Despesa, (despesa) => despesa.despesatipo)
  despesas?: Despesa[];
}
