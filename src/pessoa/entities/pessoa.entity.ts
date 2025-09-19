import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn,
  // ManyToOne, OneToMany, JoinColumn
  // ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';

// imports de relacionamentos
// import { Loja } from '../../loja/loja.entity';
// import { PessoaTipo } from '../../pessoatipo/pessoatipo.entity';
// import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pessoa_id' })
  pessoaId: number;

  @Column('varchar', { name: 'pessoa_nome', nullable: false, length: 255 })
  pessoaNome: string;

  @Column('integer', { name: 'pessoatipo_id', nullable: true })
  pessoatipoId: number | null;

  @Column('varchar', { name: 'pessoa_cpf', length: 11, nullable: true, unique: true })
  pessoaCpf: string | null;

  @Column('varchar', { name: 'pessoa_telefone', length: 20, nullable: true })
  pessoaTelefone: string | null;

  @Column('integer', { name: 'loja_id', nullable: true })
  lojaId: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'pessoa_inclusao' })
  pessoaInclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'pessoa_exclusao', nullable: true })
  pessoaExclusao: Date | null;

  // - ja deixei feito -
  // @ManyToOne(() => Loja, (loja) => loja.pessoas, { nullable: true })
  // @JoinColumn({ name: 'loja_id' })
  // loja?: Loja | null;

  // @ManyToOne(() => PessoaTipo, (pessoaTipo) => pessoaTipo.pessoas, { nullable: true })
  // @JoinColumn({ name: 'pessoatipo_id' })
  // pessoaTipo?: PessoaTipo | null;

  // @OneToMany(() => Usuario, (usuario) => usuario.pessoa)
  // usuarios?: Usuario[];
}
