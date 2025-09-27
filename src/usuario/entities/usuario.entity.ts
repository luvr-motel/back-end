import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';
import { UsuarioRole } from './usuario-role.enum';

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
}
