import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Produto {
    
    @PrimaryGeneratedColumn({ type: 'integer', name: 'produto_id' })
    produto_id: number;

    @Column({ type: "varchar", name: 'produto_descricao', nullable: true })
    produto_descricao: string;

    @Column({ type: "float", name: 'produto_custo' })
    produto_custo: number;

    @Column({ type: "float", name: 'produto_venda' })
    produto_venda: number;

    @Column({ type: 'float', name: 'produto_marckup'})
    produto_marckup: number;

    @CreateDateColumn({ type: 'timestamp', name: 'produto_inclusao' })
    produto_inclusao: Date;

    @Column({ type:'timestamp', name:'produto_exclusao' })
    produto_exclusao: Date;

}
