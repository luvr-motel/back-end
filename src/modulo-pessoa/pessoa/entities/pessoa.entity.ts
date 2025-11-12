import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToMany, RelationId } from 'typeorm';
import { PessoaTipo } from '../../pessoatipo/entities/pessoatipo.entity';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';
import { Despesa } from 'src/modulo-despesa/despesa/entities/despesa.entity';

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ name: 'pessoa_id', type: 'integer' })
  pessoa_id: number;

  @Column({ name: 'pessoa_nome', type: 'varchar' })
  pessoa_nome: string;

  @Column({ name: 'pessoa_cpf', type: 'varchar', nullable: true })
  pessoa_cpf: string;

  @Column({ name: 'pessoa_telefone', type: 'varchar', nullable: true })
  pessoa_telefone: string;

  @Column({ name: 'pessoa_ativo', type: 'boolean', default: true })
  pessoa_ativo: boolean;

  @ManyToOne(() => PessoaTipo, { nullable: true })
  @JoinColumn({ name: 'pessoatipo_id', referencedColumnName: 'pessoatipo_id' })
  pessoatipo: PessoaTipo;

  @RelationId((p: Pessoa) => p.pessoatipo)
  pessoatipo_id: number;

  // Relacionamento reverso com Locacao
  @OneToMany(() => Locacao, (locacao) => locacao.pessoa)
  locacoes: Locacao[];

  @CreateDateColumn({ name: 'pessoa_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pessoa_inclusao: Date;

  @DeleteDateColumn({ name: 'pessoa_exclusao', type: 'timestamp', nullable: true })
  pessoa_exclusao: Date;

  //relacionamento com despesa
  @OneToMany(() => Despesa, (despesa) => despesa.pessoa)
  despesa: Despesa[];
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
//NAO EXCLUIR PESSOATIPO QUANDO EXCLUIR A PESSOA
