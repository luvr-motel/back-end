import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Produto } from "../../produto/entities/produto.entity";
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";

@Entity()
export class EstoqueProduto {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'estoqueProduto_id' })
    estoqueProduto_id: number
 
    @Column({type: 'integer', name:'estoqueProduto_fisico', nullable: false })
    estoqueProduto_fisico: number

    @Column({type: 'boolean', name:'estoqueProduto_ativo', nullable: false, default: true })
    estoqueProduto_ativo: boolean

    // Relacionamento com Produto
    @ManyToOne(() => Produto, { nullable: true })
    @JoinColumn({ name: 'produto_id' })
    produto: Produto;

    @RelationId((e: EstoqueProduto) => e.produto)
    produto_id: number;

    // Relacionamento com Motel
    @ManyToOne(() => Motel, { nullable: true })
    @JoinColumn({ name: 'motel_id' })
    motel: Motel;

    @RelationId((e: EstoqueProduto) => e.motel)
    motel_id: number;
    @CreateDateColumn({ type: 'timestamp', name:'estoqueProduto_inclusao' })
    estoqueProduto_inclusao: Date

    @DeleteDateColumn({ type: 'timestamp', name: 'estoqueProduto_exclusao', nullable: true })
    estoqueProduto_exclusao: Date

}
//   estoqueProduto_id       integer [primary key]
//   estoqueProduto_fisico   integer//quanto tem em fisico mesmo
//   estoqueProduto_ativo    status
//   produto_id              integer
//   motel_id                integer //em qual motel ta 
//   estoqueProduto_inclusao timestamp
//   estoqueProduto_exclusao timestamp