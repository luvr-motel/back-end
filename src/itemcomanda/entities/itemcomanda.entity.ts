import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
  RelationId,
} from 'typeorm';

import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';

@Entity({ name: 'itemlocacao' })
export class ItemComanda {
  @PrimaryGeneratedColumn({ name: 'itemlocacao_id', type: 'integer' })
  itemLocacao_id: number;

  // ------------------------ COMANDA ------------------------
  @ManyToOne(() => Comanda, (comanda) => comanda.itens, { nullable: false })
  @JoinColumn({ name: 'comanda_id' })
  comanda: Comanda;

  @RelationId((item: ItemComanda) => item.comanda)
  comanda_id: number;

  // ------------------------ LOCACAO ------------------------
  @ManyToOne(() => Locacao, (locacao) => locacao.comandas, { nullable: false })
  @JoinColumn({ name: 'locacao_id' })
  locacao: Locacao;

  @RelationId((item: ItemComanda) => item.locacao)
  locacao_id: number;

  // ------------------------ PRODUTO ------------------------
  @ManyToOne(() => Produto, { nullable: false })
  @JoinColumn({ name: 'produto_id', referencedColumnName: 'produto_id' })
  produto: Produto;

  @RelationId((item: ItemComanda) => item.produto)
  produto_id: number;

  // ------------------------ MOTEL ------------------------
  @ManyToOne(() => Motel, { nullable: false })
  @JoinColumn({ name: 'motel_id', referencedColumnName: 'motel_id' })
  motel: Motel;

  @RelationId((item: ItemComanda) => item.motel)
  motel_id: number;

  // ------------------------ CAMPOS ------------------------
  @Column({ name: 'itemlocacao_qtde', type: 'integer', nullable: false })
  itemLocacao_qtde: number;

  @Column({ name: 'itemlocacao_valor', type: 'float', nullable: true })
  itemLocacao_valor: number;

  @CreateDateColumn({
    name: 'itemlocacao_inclusao',
    type: 'timestamp',
    default: () => 'NOW()',
  })
  itemLocacao_inclusao: Date;

  @DeleteDateColumn({
    name: 'itemlocacao_exclusao',
    type: 'timestamp',
    nullable: true,
  })
  itemLocacao_exclusao: Date | null;
}
