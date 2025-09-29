import {Column,CreateDateColumn,DeleteDateColumn,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn,} from 'typeorm';
import { Despesatipo } from '../../despesatipo/entities/despesatipo.entity';

@Entity({ name: 'despesageral' })
export class Despesageral {
  @PrimaryGeneratedColumn({ name: 'despesageral_id' })
  id: number;

  @Column({ name: 'despesageral_descricao', type: 'varchar', default: '' })
  descricao: string;

  @Column({ name: 'despesageral_parcela', type: 'int', nullable: true })
  parcela?: number | null;

  @Column({ name: 'despesageral_prestador', type: 'varchar', nullable: true })
  prestador?: string | null;

  @Column({ name: 'despesageral_itens', type: 'varchar', default: '' })
  itens: string;

  @Column({ name: 'despesatipo_id', type: 'int', nullable: true })
  despesatipoId?: number | null;

  @ManyToOne(() => Despesatipo, (tipo) => tipo.despesas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'despesatipo_id' })
  despesatipo?: Despesatipo | null;

  @CreateDateColumn({
    name: 'despesageral_inclusao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inclusao: Date;

  @DeleteDateColumn({
    name: 'despesageral_exclusao',
    type: 'timestamp',
    nullable: true,
  })
  exclusao?: Date | null;
}
