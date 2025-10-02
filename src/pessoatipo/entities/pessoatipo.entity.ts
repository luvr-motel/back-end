import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, BeforeUpdate, Index, Unique, OneToMany } from 'typeorm';
// import { Pessoa } from '../../pessoa/entities/pessoa.entity';

@Entity({ name: 'pessoatipo' })
@Unique('uq_pessoatipo_descricao', ['pessoatipoDescricao'])
export class PessoaTipo {
  @PrimaryGeneratedColumn({ name: 'pessoatipo_id' })
  pessoatipoId: number;

  @Index('idx_pessoatipo_descricao')
  @Column({ name: 'pessoatipo_descricao', type: 'varchar', length: 255, nullable: false })
  pessoatipoDescricao: string;

  @CreateDateColumn({ name: 'pessoatipo_inclusao', type: 'timestamp with time zone' })
  pessoatipoInclusao: Date;

  @UpdateDateColumn({ name: 'pessoatipo_atualizacao', type: 'timestamp with time zone' })
  pessoatipoAtualizacao: Date;

  @DeleteDateColumn({ name: 'pessoatipo_exclusao', type: 'timestamp with time zone', nullable: true })
  pessoatipoExclusao?: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  normalize() {
    if (this.pessoatipoDescricao) this.pessoatipoDescricao = this.pessoatipoDescricao.trim();
  }

  // se quisermos
  // @OneToMany(() => Pessoa, (p) => p.pessoaTipo)
  // pessoas?: Pessoa[];
}



//Vai diferenciar os tipos de pessoas ( fornecedor, prestador de serviço, funcionario, cliente )
// table pessoatipo{
//   pessoatipo_id        integer [primary key]
//   pessoatipo_descricao varchar [not null]
//   pessoatipo_inclusao  timestamp
//   pessoatipo_exclusao  timestamp
// }