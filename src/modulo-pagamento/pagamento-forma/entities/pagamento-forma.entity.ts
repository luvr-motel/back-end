import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PagamentoForma {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'pagamentoForma_id' })
  pagamentoForma_id : number;

  @Column({ type: 'varchar', name: 'pagamentoForma_descricao', nullable: false })
  pagamentoForma_descricao: string;

  @Column({ type: 'varchar', name: 'pagamentoForma_contaDestino', nullable: false })
  pagamentoForma_contaDestino: string;

//   motel_id                    integer
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