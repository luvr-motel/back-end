import { Quarto } from "../../../modulo-quarto/quarto/entities/quarto.entity";
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";
import { Pessoa } from "../../../modulo-pessoa/pessoa/entities/pessoa.entity";
import { Usuario } from "../../../modulo-pessoa/usuario/entities/usuario.entity";
import { PagamentoForma } from "../../../modulo-pagamento/pagamento-forma/entities/pagamento-forma.entity";
import { LocacaoPosicao } from "../../locacao-posicao/entities/locacao-posicao.entity";
import { Comanda } from "../../comanda/entities/comanda.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";

@Entity()
export class Locacao {

    @PrimaryGeneratedColumn({ type: 'integer', name: 'locacao_id' })
    locacao_id: number;

    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalItens', nullable: false  })
    locacao_totalItens: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalQuarto', nullable: false  })
    locacao_totalQuarto: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalDesconto', nullable: false  })
    locacao_totalDesconto: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalLocacao', nullable: false  })
    locacao_totalLocacao: number;
    
    // Relacionamento com Motel
    @ManyToOne(() => Motel, { nullable: false })
    @JoinColumn({ name: 'motel_id' })
    motel: Motel;

    @RelationId((locacao: Locacao) => locacao.motel)
    motel_id: number;

    // Relacionamento com Quarto
    @ManyToOne(() => Quarto, { nullable: false })
    @JoinColumn({ name: 'quarto_id' })
    quarto: Quarto;

    @RelationId((locacao: Locacao) => locacao.quarto)
    quarto_id: number;

    // Relacionamento com Pessoa
    @ManyToOne(() => Pessoa, { nullable: false })
    @JoinColumn({ name: 'pessoa_id' })
    pessoa: Pessoa;

    @RelationId((locacao: Locacao) => locacao.pessoa)
    pessoa_id: number;

    // Relacionamento com PagamentoForma
    @ManyToOne(() => PagamentoForma, { nullable: true })
    @JoinColumn({ name: 'pagamentoforma_id' })
    pagamentoForma: PagamentoForma;

    @RelationId((locacao: Locacao) => locacao.pagamentoForma)
    pagamentoforma_id: number;

    // Relacionamento com Usuario
    @ManyToOne(() => Usuario, { nullable: true })
    @JoinColumn({ name: 'usuario_id' })
    usuario: Usuario;

    @RelationId((locacao: Locacao) => locacao.usuario)
    usuario_id: number;

    // Relacionamento com LocacaoPosicao
    @ManyToOne(() => LocacaoPosicao, { nullable: true })
    @JoinColumn({ name: 'locacaoPosicao_id' })
    locacaoPosicao: LocacaoPosicao;

    @RelationId((locacao: Locacao) => locacao.locacaoPosicao)
    locacaoPosicao_id: number;

    // Relacionamento reverso com Comanda
    @OneToMany(() => Comanda, (comanda) => comanda.locacao)
    comandas: Comanda[];

    @CreateDateColumn({type:'timestamp', name: 'locacao_inclusao'})
    locacao_inclusao: Date;
    
    @DeleteDateColumn({ type:'timestamp', name:'locacao_exclusao', nullable: true  })
    locacao_exclusao: Date;    

}
