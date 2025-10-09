import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, Unique } from 'typeorm';

@Entity({ name: 'pessoatipo' })
@Unique('uq_pessoatipo_descricao', ['pessoatipo_descricao'])
export class PessoaTipo {
  @PrimaryGeneratedColumn({ name: 'pessoatipo_id', type: 'integer' })
  pessoatipo_id: number;

  @Column({ name: 'pessoatipo_descricao', type: 'varchar', length: 255, nullable: false })
  pessoatipo_descricao: string;

  @CreateDateColumn({ name: 'pessoatipo_inclusao', type: 'timestamptz', default: () => 'NOW()' })
  pessoatipo_inclusao: Date;

  @DeleteDateColumn({ name: 'pessoatipo_exclusao', type: 'timestamptz', nullable: true })
  pessoatipo_exclusao: Date | null;
}



//Vai diferenciar os tipos de pessoas ( fornecedor, prestador de serviço, funcionario, cliente )
// table pessoatipo{
//   pessoatipo_id        integer [primary key]
//   pessoatipo_descricao varchar [not null]
//   pessoatipo_inclusao  timestamp
//   pessoatipo_exclusao  timestamp
// }