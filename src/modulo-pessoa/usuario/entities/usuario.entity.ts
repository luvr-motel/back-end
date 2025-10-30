import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, RelationId, Index, Unique } from 'typeorm'; 
import { Pessoa } from '../../pessoa/entities/pessoa.entity'; 
import { UsuarioRole } from './usuario-role.enum';
import { Motel } from '../../../modulo-motel/motel/entities/motel.entity';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';

export enum UsuarioStatus { ATIVO = 'ativo', INATIVO = 'inativo' }

@Entity({ name: 'usuario' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'usuario_id', type: 'integer' })
  usuario_id: number;

  @Column({ name: 'usuario_codigo', type: 'varchar', nullable: false })
  usuario_codigo: string;

  @Column({ name: 'usuario_senha', type: 'varchar', nullable: false })
  usuario_senha: string;

  @Column({ name: 'usuario_ativo', type: 'enum', enum: UsuarioStatus, default: UsuarioStatus.ATIVO })
  usuario_ativo: UsuarioStatus;

  @ManyToOne(() => Pessoa, { nullable: true })
  @JoinColumn({ name: 'pessoa_id', referencedColumnName: 'pessoa_id' })
  pessoa: Pessoa;

  @RelationId((u: Usuario) => u.pessoa)
  pessoa_id: number;

  // Relacionamento com Motel
  @ManyToOne(() => Motel, { nullable: true })
  @JoinColumn({ name: 'motel_id' })
  motel?: Motel | null;

  @RelationId((u: Usuario) => u.motel)
  motel_id?: number | null;

  // Relacionamento reverso com Locacao
  @OneToMany(() => Locacao, (locacao) => locacao.usuario)
  locacoes: Locacao[];

  @Column({ name: 'usuario_role', type: 'enum', enum: UsuarioRole, nullable: true })
  usuario_role: UsuarioRole;

  @CreateDateColumn({ name: 'usuario_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  usuario_inclusao: Date;

  @DeleteDateColumn({ name: 'usuario_exclusao', type: 'timestamp', nullable: true })
  usuario_exclusao: Date;
}
