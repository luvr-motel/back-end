import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { UsuarioRole } from './usuario-role.enum';
import { Caixa } from 'src/caixa/entities/caixa.entity';

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id', type: 'int' })
  usuarioId: number;

  @Column({ name: 'usuario_codigo', length: 120, unique: true })
  usuarioCodigo: string;

  @Column({ name: 'usuario_senha', length: 255, select: false })
  usuarioSenha: string;

  @Column({ name: 'usuario_ativo', type: 'boolean', default: true })
  usuarioAtivo: boolean;

  @Column('text', { name: 'roles', array: true, default: '{}' })
  roles: UsuarioRole[];

  @Column('int', { name: 'loja_id', nullable: true })
  lojaId: number | null;

  @ManyToOne(() => Pessoa, { nullable: true })
  @JoinColumn({ name: 'pessoa_id' })
  pessoa?: Pessoa | null;

  @CreateDateColumn({ name: 'usuario_inclusao', type: 'timestamptz' })
  usuarioInclusao: Date;

  @DeleteDateColumn({ name: 'usuario_exclusao', type: 'timestamptz', nullable: true })
  usuarioExclusao?: Date | null;

  // - caixa pro futuro -
  @OneToMany(() => Caixa, (caixa) => caixa.usuario)
  caixas: Caixa[];  
}

// table usuario {
//   usuario_id       integer [primary key]
//   usuario_codigo   varchar [not null]
//   usuario_senha    varchar [not null] // hash
//   pessoa_id        integer
//   usuario_ativo    status
//   loja_id          integer
//   usuario_inclusao timestamp
//   usuario_exclusao timestamp
// }
// ref: usuario.pessoa_id > pessoa.pessoa_id
// ref: loja.loja_id > usuario.loja_id