import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId, Index, Unique } from 'typeorm'; 
import { Pessoa } from '../../pessoa/entities/pessoa.entity'; 
import { UsuarioRole } from './usuario-role.enum';
// import { Motel } from '../../motel/entities/motel.entity';

export enum UsuarioStatus { ATIVO = 'ativo', INATIVO = 'inativo' }

@Entity({ name: 'usuario' })
@Unique('uq_usuario_codigo', ['usuario_codigo'])
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id', type: 'integer' })
  usuario_id: number;

  @Column({ name: 'usuario_codigo', type: 'varchar', length: 255, nullable: false })
  usuario_codigo: string;

  @Column({ name: 'usuario_senha', type: 'varchar', length: 255, nullable: false })
  usuario_senha: string;

  @Column({ name: 'usuario_ativo', type: 'enum', enum: UsuarioStatus, default: UsuarioStatus.ATIVO })
  usuario_ativo: UsuarioStatus;

  @ManyToOne(() => Pessoa, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pessoa_id', referencedColumnName: 'pessoa_id' })
  pessoa?: Pessoa | null;

  @RelationId((u: Usuario) => u.pessoa)
  pessoa_id: number | null;

  // relacao do motel
  // @ManyToOne(() => Motel, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  // @JoinColumn({ name: 'motel_id', referencedColumnName: 'motel_id' })
  // motel?: Motel | null;

  // @RelationId((u: Usuario) => u.motel)
  // motel_id?: number | null;

  @Column({ name: 'usuario_role', type: 'enum', enum: UsuarioRole, nullable: true })
  usuario_role?: UsuarioRole | null;

  @CreateDateColumn({ name: 'usuario_inclusao', type: 'timestamptz', default: () => 'NOW()' })
  usuario_inclusao: Date;

  @DeleteDateColumn({ name: 'usuario_exclusao', type: 'timestamptz', nullable: true })
  usuario_exclusao: Date | null;
}

// Usuario do sistema de fato, os funcionarios 
// table usuario {
//   usuario_id       integer [primary key]
//   usuario_codigo   varchar [not null]
//   usuario_senha    varchar [not null] // hash
//   usuario_ativo    status
//   pessoa_id        integer
//   motel_id         integer
//   usuario_inclusao timestamp
//   usuario_exclusao timestamp
// }
// ref: usuario.pessoa_id > pessoa.pessoa_id
// ref: motel.motel_id > usuario.motel_id