import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { PessoaTipo } from '../../pessoatipo/entities/pessoatipo.entity';

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'pessoa_id', type: 'integer' })
  pessoa_id: number;

  @Column({ name: 'pessoa_nome', type: 'varchar', length: 255 })
  pessoa_nome: string;

  @Column({ name: 'pessoa_cpf', type: 'varchar', length: 11, nullable: true })
  pessoa_cpf?: string | null;

  @Column({ name: 'pessoa_telefone', type: 'varchar', length: 20, nullable: true })
  pessoa_telefone?: string | null;

  @Column({ name: 'pessoa_ativo', type: 'boolean', default: true })
  pessoa_ativo: boolean;

  @ManyToOne(() => PessoaTipo, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pessoatipo_id', referencedColumnName: 'pessoatipo_id' })
  pessoatipo?: PessoaTipo | null;

  @RelationId((p: Pessoa) => p.pessoatipo)
  pessoatipo_id: number | null;

  @CreateDateColumn({ name: 'pessoa_inclusao', type: 'timestamptz', default: () => 'NOW()' })
  pessoa_inclusao: Date;

  @DeleteDateColumn({ name: 'pessoa_exclusao', type: 'timestamptz', nullable: true })
  pessoa_exclusao: Date | null;
}


//NAO EXCLUIR PESSOATIPO QUANDO EXCLUIR A PESSOA