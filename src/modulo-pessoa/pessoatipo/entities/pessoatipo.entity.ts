import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({ name: 'pessoatipo' })
export class PessoaTipo {
  @PrimaryGeneratedColumn({ name: 'pessoatipo_id', type: 'integer' })
  pessoatipo_id: number;

  @Column({ name: 'pessoatipo_descricao', type: 'varchar', nullable: false })
  pessoatipo_descricao: string;

  @CreateDateColumn({ name: 'pessoatipo_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pessoatipo_inclusao: Date;

  @DeleteDateColumn({ name: 'pessoatipo_exclusao', type: 'timestamp', nullable: true })
  pessoatipo_exclusao: Date;
}


//Vai diferenciar os tipos de pessoas ( fornecedor, prestador de serviço, funcionario, cliente )
// table pessoatipo{
//   pessoatipo_id        integer [primary key]
//   pessoatipo_descricao varchar [not null]
//   pessoatipo_inclusao  timestamp
//   pessoatipo_exclusao  timestamp
// }