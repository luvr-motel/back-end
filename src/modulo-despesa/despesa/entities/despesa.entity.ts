import {Column,CreateDateColumn,DeleteDateColumn,Entity,JoinColumn,ManyToOne,OneToMany,PrimaryGeneratedColumn,} from 'typeorm';
import { Despesatipo } from '../../despesatipo/entities/despesatipo.entity';

@Entity()
export class Despesa {
  @PrimaryGeneratedColumn({ name: 'despesa_id', type: 'integer' })
  despesa_id: number;

  @Column({ name: 'despesa_descricao', type: 'varchar'})
  despesa_descricao: string;

  @Column({ name: 'despesa_parcela', type: 'integer', nullable: true })
  despesa_parcela: number;

  @Column({name: 'despesa_valortotal',type: 'decimal', precision: 10,scale: 2, nullable: true })
  despesa_valortotal: number;

  // relacionamento com pessoa_id
  // @ManyToOne(()=> Pessoa, (pessoa)=> pessoa.despesas, {onDelete: 'SET NULL)

  @Column({ name: 'despesa_aberto', type: 'boolean', default: true })
  despesa_aberto: boolean;

  @Column({ name: 'despesatipo_id', type: 'integer', nullable: true })
  despesatipoId: number;

  @ManyToOne(() => Despesatipo, (tipo) => tipo.despesas, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'despesatipo_id' })
  despesatipo: Despesatipo ;
  
  // @ManyToOne(() => usuario => usuario.despesas)
  // @OneToMany(()=> Motel, (motel)=> motel.despesa))

  @CreateDateColumn({type: 'timestamp', name: 'despesa_inclusao' })
  despesa_inclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'despesa_exclusao', nullable: true})
  despesa_exclusao: Date;
}
