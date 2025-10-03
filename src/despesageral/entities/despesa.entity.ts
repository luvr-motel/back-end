import {Column,CreateDateColumn,DeleteDateColumn,Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn,} from 'typeorm';
import { Despesatipo } from '../../despesatipo/entities/despesatipo.entity';

@Entity({ name: 'despesa' })
export class Despesa {
  @PrimaryGeneratedColumn({ name: 'despesa_id' })
  id: number;

  @Column({ name: 'despesa_descricao', type: 'varchar', default: '' })
  descricao: string;

  @Column({ name: 'despesa_parcela', type: 'int', nullable: true })
  parcela?: number | null;

  @Column({ name: 'despesa_prestador', type: 'varchar', nullable: true })
  prestador?: string | null;

  @Column({ name: 'despesa_itens', type: 'varchar', default: '' })
  itens: string;

  @Column({ name: 'despesatipo_id', type: 'int', nullable: true })
  despesatipoId?: number | null;

  @ManyToOne(() => Despesatipo, (tipo) => tipo.despesas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'despesatipo_id' })
  despesatipo?: Despesatipo | null;

  // @OneToMany(()=> Motel, (motel)=> motel.despesa){
  // 
  // })

  @CreateDateColumn({
    name: 'despesa_inclusao',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  inclusao: Date;

  @DeleteDateColumn({
    name: 'despesa_exclusao',
    type: 'timestamp',
    nullable: true,
  })
  exclusao?: Date | null;
}
