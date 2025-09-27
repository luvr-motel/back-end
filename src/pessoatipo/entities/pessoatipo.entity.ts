import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';

@Entity({ name: 'pessoatipo' })
export class PessoaTipo {
  @PrimaryGeneratedColumn({ name: 'pessoatipo_id' })
  id: number;

  @Column({ name: 'pessoatipo_descricao', length: 120, unique: true })
  descricao: string;

  @CreateDateColumn({ name: 'pessoatipo_inclusao' })
  inclusao: Date;

  @DeleteDateColumn({ name: 'pessoatipo_exclusao', nullable: true })
  exclusao?: Date;

  @OneToMany(() => Pessoa, (p) => p.pessoaTipo)
  pessoas?: Pessoa[];
}

// table pessoatipo{//validar enum
//   pessoatipo_id        integer [primary key]
//   pessoatipo_descricao varchar [not null]
//   pessoatipo_inclusao  timestamp
//   pessoatipo_exclusao  timestamp
// }
// ref: pessoa.pessoatipo_id > pessoatipo.pessoatipo_id
