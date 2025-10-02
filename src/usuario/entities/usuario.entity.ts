import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
// temporario
import { UsuarioRole } from './usuario-role.enum';
//import { Motel } from '../../motel/entities/motel.entity';

export enum UsuarioStatus { ATIVO = 'ativo', INATIVO = 'inativo' }

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id' })
  usuarioId: number;

  @Column({ name: 'usuario_codigo', type: 'varchar', length: 255, nullable: false })
  usuarioCodigo: string;

  @Column({ name: 'usuario_senha', type: 'varchar', length: 255, nullable: false })
  usuarioSenha: string;

  @Column({ name: 'usuario_ativo', type: 'enum', enum: UsuarioStatus, default: UsuarioStatus.ATIVO })
  usuarioAtivo: UsuarioStatus;

  @ManyToOne(() => Pessoa, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa | null;

  @RelationId((u: Usuario) => u.pessoa)
  pessoaId?: number | null;

  //temporario ate achar outro jeito
  @Column({
  name: 'roles',
  type: 'enum',
  enum: UsuarioRole,
  array: true,
  default: [UsuarioRole.RECEPCIONISTA],
})
roles: UsuarioRole[];

  // @ManyToOne(() => Motel, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  // @JoinColumn({ name: 'motel_id' })
  // motel?: Motel | null;

  // @RelationId((u: Usuario) => u.motel)
  // motelId?: number | null;

  @CreateDateColumn({ name: 'usuario_inclusao', type: 'timestamp with time zone' })
  usuarioInclusao: Date;

  @DeleteDateColumn({ name: 'usuario_exclusao', type: 'timestamp with time zone', nullable: true })
  usuarioExclusao?: Date | null;
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