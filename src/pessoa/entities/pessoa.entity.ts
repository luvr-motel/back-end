import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId, BeforeInsert, BeforeUpdate } from 'typeorm';
import { PessoaTipo } from '../../pessoatipo/entities/pessoatipo.entity';

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'pessoa_id' })
  pessoaId: number;

  @Column({ name: 'pessoa_nome', length: 255 })
  pessoaNome: string;

  @Column({ name: 'pessoa_cpf', type: 'varchar', length: 11, nullable: true })
  pessoaCpf?: string | null;

  @Column({ name: 'pessoa_telefone', type: 'varchar', length: 20, nullable: true })
  pessoaTelefone?: string | null;

  @Column({ name: 'pessoa_ativo', default: true })
  pessoaAtivo: boolean;

  @ManyToOne(() => PessoaTipo, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'pessoatipo_id' })
  pessoaTipo?: PessoaTipo | null;

  @RelationId((p: Pessoa) => p.pessoaTipo)
  pessoatipoId?: number | null;

  @CreateDateColumn({ name: 'pessoa_inclusao' })
  pessoaInclusao: Date;

  @DeleteDateColumn({ name: 'pessoa_exclusao', nullable: true })
  pessoaExclusao?: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    if (this.pessoaCpf) this.pessoaCpf = this.pessoaCpf.replace(/\D/g, '').trim();
    if (this.pessoaNome) this.pessoaNome = this.pessoaNome.trim();
  }
}



//Tabela responsavel por receber as informações das pessoas cadastradas
// table pessoa {
//   pessoa_id       integer [primary key]
//   pessoa_nome     varchar [not null] 
//   pessoa_cpf      varchar 
//   pessoa_telefone integer
//   pessoa_ativo    boolean
//   pessoatipo_id   integer 
//   pessoa_inclusao timestamp
//   pessoa_exclusao timestamp
// }
// ref: pessoa.pessoatipo_id > pessoatipo.pessoatipo_id