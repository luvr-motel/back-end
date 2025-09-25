import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId,
// OneToMany
} from 'typeorm';
import { PessoaTipo } from '../../pessoatipo/entities/pessoatipo.entity';
// import { Loja } from '../../loja/loja.entity';
// import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'pessoa_id' })
  pessoaId: number;

  @Column({ name: 'pessoa_nome', length: 255, nullable: false })
  pessoaNome: string;

  @ManyToOne(() => PessoaTipo, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'pessoatipo_id' })
  pessoaTipo?: PessoaTipo;

  @RelationId((p: Pessoa) => p.pessoaTipo)
  pessoatipoId?: number;

  @Column({ name: 'pessoa_cpf', length: 11, nullable: true, unique: true })
  pessoaCpf?: string;

  @Column({ name: 'pessoa_telefone', length: 20, nullable: true })
  pessoaTelefone?: string;

  @Column({ name: 'loja_id', nullable: true })
  lojaId?: number;

  @CreateDateColumn({ name: 'pessoa_inclusao' })
  pessoaInclusao: Date;

  @DeleteDateColumn({ name: 'pessoa_exclusao', nullable: true })
  pessoaExclusao?: Date;

  // - ja ta pronto -
  // @ManyToOne(() => Loja, (loja) => loja.pessoas, { nullable: true })
  // @JoinColumn({ name: 'loja_id' })
  // loja?: Loja | null;

  // @OneToMany(() => Usuario, (usuario) => usuario.pessoa)
  // usuarios?: Usuario[];
}


// table pessoa {
//   pessoa_id       integer [primary key]
//   pessoa_nome     varchar [not null]
//   pessoatipo_id   integer  
//   pessoa_cpf      varchar 
//   pessoa_telefone integer
//   loja_id         integer // atrelar pessoa aquele motel
//   pessoa_inclusao timestamp
//   pessoa_exclusao timestamp
// }