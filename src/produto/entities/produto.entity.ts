import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Produto {
    
    @PrimaryGeneratedColumn({ type: 'integer', name: 'produto_id' })
    produto_id: number;

    @Column({ type: "varchar", name: 'produto_decricao', nullable: true, length:200 })
    produto_descricao: string;

    @Column({ type: "float", name: 'produto_custo' })
    produto_custo: number;

    @Column({ type: "float", name: 'produto_venda' })
    produto_venda: number;

    @CreateDateColumn({ type: 'timestamp', name: 'produto_inclusao' })
    produto_inclusao: Date;

    //produto_exclusao
    //produto_markup
    //produto_pontaEstoque
}
