import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Locacao } from "../../../modulo-locacao/locacao/entities/locacao.entity";
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";

@Entity()
export class PagamentoForma {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pagamentoForma_id' })
  pagamentoForma_id : number;

  @Column({ type: 'varchar', name: 'pagamentoForma_descricao', nullable: false })
  pagamentoForma_descricao: string;

  @Column({ type: 'varchar', name: 'pagamentoForma_contaDestino', nullable: false })
  pagamentoForma_contaDestino: string;

  // Relacionamento com Motel
  @ManyToOne(() => Motel, { nullable: true })
  @JoinColumn({ name: 'motel_id' })
  motel: Motel;

  @RelationId((p: PagamentoForma) => p.motel)
  motel_id: number;

  // Relacionamento reverso com Locacao
  @OneToMany(() => Locacao, (locacao) => locacao.pagamentoForma)
  locacoes: Locacao[];

  @CreateDateColumn({ type: 'timestamp', name: 'pagamentoforma_inclusao' })
  pagamentoforma_inclusao: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'pagamentoforma_exclusao', nullable: true })
  pagamentoforma_exclusao : Date;
}
