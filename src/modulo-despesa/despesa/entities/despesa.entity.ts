import {Column,CreateDateColumn,DeleteDateColumn,Entity,JoinColumn,ManyToOne,PrimaryGeneratedColumn} from 'typeorm';
import { Despesatipo } from '../../despesatipo/entities/despesatipo.entity';
import { Usuario } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Pessoa } from 'src/modulo-pessoa/pessoa/entities/pessoa.entity';

@Entity()
export class Despesa {
  @PrimaryGeneratedColumn({ name: 'despesa_id', type: 'integer' })
  despesa_id: number;

  @Column({name: 'despesa_descricao',type: 'varchar',length: 255,default: ''})
  despesa_descricao: string;

  @Column({ name: 'despesa_parcela', type: 'integer', nullable: true })
  despesa_parcela: number;

  // relacionamento com pessoa_id
  @ManyToOne(() => Pessoa, (pessoa) => pessoa.despesa, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa: Pessoa | null;

  @Column({ name: 'despesa_aberto', type: 'boolean', default: true })
  despesa_aberto: boolean;

  @ManyToOne(() => Despesatipo, (despesatipo) => despesatipo.despesa, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'despesatipo_id' })
  despesatipo: Despesatipo;
  
  @Column({
    name: 'despesa_total',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  despesa_total: number;

  // relacionamento com usuario
  @ManyToOne(() => Usuario, (usuario) => usuario.despesas, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;

  // relacionamento com motel
  @ManyToOne(() => Motel, (motel) => motel.despesa, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'motel_id' })
  motel: Motel;

  
  @CreateDateColumn({type: 'timestamp', name: 'despesa_inclusao' })
  despesa_inclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'despesa_exclusao', nullable: true})
  despesa_exclusao: Date;
}
