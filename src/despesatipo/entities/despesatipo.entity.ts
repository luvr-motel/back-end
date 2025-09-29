import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Despesageral } from '../../despesageral/entities/despesageral.entity';

@Entity({ name: 'despesatipo' })
export class Despesatipo {
  @PrimaryGeneratedColumn({ name: 'despesatipo_id' })
  id: number;

  @Column({ name: 'despesatipo_descricao', type: 'varchar' })
  descricao: string;

  @Column({ name: 'despesatipo_ativo', type: 'boolean', default: true })
  ativo: boolean;

  @CreateDateColumn({
    name: 'despesatipo_inclusao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inclusao: Date;

  @DeleteDateColumn({
    name: 'despesatipo_exclusao',
    type: 'timestamp',
    nullable: true,
  })
  exclusao?: Date | null;

  @OneToMany(() => Despesageral, (despesa) => despesa.despesatipo)
  despesas?: Despesageral[];
}
