import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Locacao } from "../../../modulo-locacao/locacao/entities/locacao.entity";
import { Recebimento } from '../../recebimento/entities/recebimento.entity';
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";

@Entity({ name: 'pagamento_forma' })
export class PagamentoForma {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pagamentoForma_id' })
  pagamentoForma_id : number;

  @Column({ type: 'varchar', name: 'pagamentoForma_descricao', nullable: false })
  pagamentoForma_descricao: string;

  @Column({ type: 'varchar', name: 'pagamentoForma_contaDestino', nullable: false })
  pagamentoForma_contaDestino: string;

  @ManyToOne(() => Recebimento, (recebimento) => recebimento.pagamentoforma_id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'recebimento_id' })
  recebimento: Recebimento;

//   motel_id                    integer
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
// table pagamentoforma {
//   pagamentoforma_id           integer
//   pagamentoforma_descricao    varchar
//   pagamentoforma_contaDestino varchar
//   motel_id                    integer
//   pagamentoforma_inclusao     timestamp
//   pagamentoforma_exclusao     timestamp
// }
// ref: motel.motel_id
