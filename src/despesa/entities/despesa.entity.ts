import {Column,CreateDateColumn,DeleteDateColumn,Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn,} from 'typeorm';
import { Despesatipo } from '../../despesatipo/entities/despesatipo.entity';

@Entity({ name: 'despesa' })
export class Despesa {
  @PrimaryGeneratedColumn({ name: 'despesa_id' })
  despesa_id: number;

  @Column({ name: 'despesa_descricao', type: 'varchar'})
  despesa_descricao: string;

  @Column({ name: 'despesa_parcela', type: 'int', nullable: true })
  despesa_parcela: number | null;

  @Column({name: 'despesa_valortotal',type: 'decimal',precision: 10,scale: 2,default: 0,})
  despesa_valortotal: number;

  // relacionamento com pessoa_id
  // @ManyToOne(()=> Pessoa, (pessoa)=> pessoa.despesas, {onDelete: 'SET NULL)

  @Column({ name: 'despesa_aberto', type: 'boolean', default: true,nullable: false })
  despesa_aberto: boolean;

  @Column({ name: 'despesatipo_id', type: 'int', nullable: true })
  despesatipoId?: number | null;

  @ManyToOne(() => Despesatipo, (tipo) => tipo.despesas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'despesatipo_id' })
  despesatipo?: Despesatipo | null;
  
  // @ManyToOne(() => usuario => usuario.despesas)
  // @OneToMany(()=> Motel, (motel)=> motel.despesa))

  @CreateDateColumn({type: 'timestamp', name: 'despesa_inclusao' })
  despesa_inclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'despesa_exclusao', nullable: true})
  despesa_exclusao: Date;
}
