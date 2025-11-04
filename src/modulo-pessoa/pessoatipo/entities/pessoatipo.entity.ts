import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from 'typeorm';
import { Pessoa } from '../../pessoa/entities/pessoa.entity';

@Entity({ name: 'pessoatipo' })
export class PessoaTipo {
  @PrimaryGeneratedColumn({ name: 'pessoatipo_id', type: 'integer' })
  pessoatipo_id: number;

  @Column({ name: 'pessoatipo_descricao', type: 'varchar', nullable: false })
  pessoatipo_descricao: string;

  // Relacionamento reverso com Pessoa
  @OneToMany(() => Pessoa, (pessoa) => pessoa.pessoatipo)
  pessoas: Pessoa[];

  @CreateDateColumn({ name: 'pessoatipo_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  pessoatipo_inclusao: Date;

  @DeleteDateColumn({ name: 'pessoatipo_exclusao', type: 'timestamp', nullable: true })
  pessoatipo_exclusao: Date;
}
