import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Recebimento {
    @PrimaryGeneratedColumn({ name: 'recebimento_id', type: 'integer' })
    recebimento_id: number;

    @Column({ name: 'recebimento_descricao', type: 'varchar', length: 255, nullable: false })
    recebimento_descricao: string;

// relacionamento com pagamentoforma_id

// relacionamento com motel_id


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