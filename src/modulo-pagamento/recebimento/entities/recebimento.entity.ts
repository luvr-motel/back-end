import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";
import { PagamentoForma } from "../../pagamento-forma/entities/pagamento-forma.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recebimento {
    @PrimaryGeneratedColumn({ name: 'recebimento_id', type: 'integer' })
    recebimento_id: number;

    @Column({ name: 'recebimento_descricao', type: 'varchar', length: 255, nullable: false })
    recebimento_descricao: string;

    @Column({ name: 'recebimento_total', type: 'decimal', precision: 10, scale: 2, nullable: true })
    recebimento_total: number;

// relacionamento com pagamentoforma_id
    @OneToMany(() => PagamentoForma, (pagamentoForma) => pagamentoForma.recebimento, {
      nullable: true,
    })
    pagamentoforma_id: PagamentoForma[];

// relacionamento com motel_id
    @ManyToOne(() => Motel, (motel) => motel.recebimento)
    motel_id: Motel;

    @CreateDateColumn({ name: 'recebimento_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    recebimento_inclusao: Date;

    @DeleteDateColumn({ name: 'recebimento_exclusao', type: 'timestamp', nullable: true })
    recebimento_exclusao: Date | null;
}

// table recebimento { // receber pagar
//   recebimento_id          integer [primary key]
//   recebimento_decricao    varchar [not null]
//   pagamentoforma_id       integer
//   motel_id                integer
//   recebimento_inclusao    timestamp
//   recebimento_exclusao    timestamp
