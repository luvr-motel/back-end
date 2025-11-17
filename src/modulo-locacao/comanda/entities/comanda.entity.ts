import { Locacao } from "../../locacao/entities/locacao.entity";
import { Produto } from "../../../modulo-produto/produto/entities/produto.entity";
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity({ name: 'comanda' })
export class Comanda {
   @PrimaryGeneratedColumn({ type: 'integer', name: 'comanda_id' })
   comanda_id: number;

   @Column({ type:'numeric', precision: 10, scale: 2 , name: 'comanda_qtde', nullable: false })
   comanda_qtde: number;

   @Column({ type: 'varchar', name: 'comanda_observacao', nullable: true })
   comanda_observacao: string;

   // Relacionamento com Locacao
   @ManyToOne(() => Locacao, (locacao) => locacao.comandas, { nullable: false })
   @JoinColumn({ name: 'locacao_id' })
   locacao: Locacao;

   @RelationId((comanda: Comanda) => comanda.locacao)
   locacao_id: number;

   // Relacionamento com Produto
   @ManyToOne(() => Produto, { nullable: false })
   @JoinColumn({ name: 'produto_id' })
   produto: Produto;

   @RelationId((comanda: Comanda) => comanda.produto)
   produto_id: number;

   // Relacionamento com Motel
   @ManyToOne(() => Motel, { nullable: false })
   @JoinColumn({ name: 'motel_id' })
   motel: Motel;

   @RelationId((comanda: Comanda) => comanda.motel)
   motel_id: number;

   @CreateDateColumn({ type:'timestamp', name: 'comanda_inclusao' })
   comanda_inclusao: Date;

   @DeleteDateColumn({ type:'timestamp', name:'comanda_exclusao', nullable: true })
   comanda_exclusao: Date;
}
