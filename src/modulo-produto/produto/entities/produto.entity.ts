import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany } from "typeorm"
import { Comanda } from "../../../modulo-locacao/comanda/entities/comanda.entity";

@Entity()
export class Produto {
    
    @PrimaryGeneratedColumn({ type: 'integer', name: 'produto_id' })
    produto_id: number;

    @Column({ type: "varchar", name: 'produto_descricao', nullable: false })
    produto_descricao: string;

    @Column({ type: "numeric", precision: 10, scale: 2 , name: 'produto_custo', nullable: false })
    produto_custo: number;

    @Column({ type: "numeric", precision: 10, scale: 2 , name: 'produto_venda', nullable: true })
    produto_venda: number;

    @Column({ type: 'numeric', precision: 10, scale: 2 , name: 'produto_marckup', nullable: true })
    produto_marckup: number;

    // Relacionamento reverso com Comanda
    @OneToMany(() => Comanda, (comanda) => comanda.produto)
    comandas: Comanda[];

    @CreateDateColumn({ type: 'timestamp', name: 'produto_inclusao' })
    produto_inclusao: Date;

    @DeleteDateColumn({ type:'timestamp', name:'produto_exclusao', nullable: true })
    produto_exclusao: Date;

}
