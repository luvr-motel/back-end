import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Produto {
    
    @PrimaryGeneratedColumn()
    produto_id: number;

    @Column({ type: "varchar"})
    produto_descricao: string;

    @Column({ type: "float" })
    produto_custo: number;

    @Column({ type: "float" })
    produto_venda: number

    @CreateDateColumn()
    produto_inclusao: Date;

    // @CreateDateColumn()
    // produto_exclusa: Date;
}
