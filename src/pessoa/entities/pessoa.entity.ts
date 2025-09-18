import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn /*, ManyToOne, OneToMany, JoinColumn*/ } from 'typeorm';
//import { Loja } from '../../loja/loja.entity';
//import { PessoaTipo } from '../../pessoatipo/pessoatipo.entity';
//import { Usuario } from '../../usuario/usuario.entity';
//import { RegistroPonto } from '../../registro-ponto/registro-ponto.entity';
//import { MovimentacaoQuarto } from '../../movimentacao-quarto/movimentacao-quarto.entity';
//import { NotaFiscal } from '../../nota-fiscal/nota-fiscal.entity'; 

@Entity({ name: 'pessoa' })
export class Pessoa {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pessoa_id' })
  pessoaId: number;

  @Column('varchar', { name: 'pessoa_nome', nullable: false, length: 255 })
  pessoaNome: string;

  @Column('integer', { name: 'pessoatipo_id', nullable: true })
  pessoatipoId: number | null;

  @Column('integer', { name: 'loja_id', nullable: true })
  lojaId: number | null;

  @CreateDateColumn({ type: 'timestamp', name: 'pessoa_inclusao' })
  pessoaInclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'pessoa_exclusao', nullable: true })
  pessoaExclusao: Date | null;

  // ja deixei feito vai corinthians
  //@ManyToOne(() => Loja, (loja) => loja.pessoas, { nullable: true })
  //@JoinColumn({ name: 'loja_id' })
  //loja?: Loja | null;

  //@ManyToOne(() => PessoaTipo, (pessoaTipo) => pessoaTipo.pessoas, { nullable: true })
  //@JoinColumn({ name: 'pessoatipo_id' })
  //pessoaTipo?: PessoaTipo | null;

  //@OneToMany(() => Usuario, (usuario) => usuario.pessoa)
  //usuarios?: Usuario[];

  //@OneToMany(() => RegistroPonto, (registro) => registro.pessoa)
  //registrosPonto?: RegistroPonto[];

  //@OneToMany(() => MovimentacaoQuarto, (mov) => mov.pessoa)
  //movimentacoesQuarto?: MovimentacaoQuarto[];

  //@OneToMany(() => NotaFiscal, (nf) => nf.pessoa)
  //notasFiscais?: NotaFiscal[];
  //*/
}