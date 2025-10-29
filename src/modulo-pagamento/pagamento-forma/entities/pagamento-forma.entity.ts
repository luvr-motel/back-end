import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Locacao } from "../../../modulo-locacao/locacao/entities/locacao.entity";

@Entity()
export class PagamentoForma {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pagamentoForma_id' })
  pagamentoForma_id : number;

  @Column({ type: 'varchar', name: 'pagamentoForma_descricao', nullable: false })
  pagamentoForma_descricao: string;

  @Column({ type: 'varchar', name: 'pagamentoForma_contaDestino', nullable: false })
  pagamentoForma_contaDestino: string;

  // Relacionamento reverso com Locacao
  @OneToMany(() => Locacao, (locacao) => locacao.pagamentoForma)
  locacoes: Locacao[];

  @CreateDateColumn({ type: 'timestamp', name: 'pagamentoforma_inclusao' })
  pagamentoforma_inclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'pagamentoforma_exclusao', nullable: true })
  pagamentoforma_exclusao : Date;
}
