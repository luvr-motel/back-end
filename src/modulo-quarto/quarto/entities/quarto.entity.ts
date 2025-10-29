import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { QuartoTipo } from "../../quarto_tipo/entities/quarto_tipo.entity";
import { Locacao } from "../../../modulo-locacao/locacao/entities/locacao.entity";

@Entity('quarto')
export class Quarto {
    @PrimaryGeneratedColumn()
    quarto_id: number;

    @Column({ name:'quarto_descricao', type:'varchar', length: 256 })
    quarto_descricao: string;

    @Column({ name: 'quarto_atributos', type: 'varchar', nullable: true })
    quarto_atributos: string;

    @Column({ name:'quarto_ativo', type: 'boolean', default: false })
    quarto_ativo: boolean;

    @ManyToOne(() => QuartoTipo, { eager: true, nullable: false })
    @JoinColumn({ name: 'quartotipo_id' })
    quartotipo: QuartoTipo;

    @RelationId((quarto: Quarto) => quarto.quartotipo)
    quartotipo_id: number;

    // Relacionamento reverso com Locacao
    @OneToMany(() => Locacao, (locacao) => locacao.quarto)
    locacoes: Locacao[];

    @CreateDateColumn({ type:'timestamp', name:'quarto_inclusao' })
    quarto_inclusao: Date;

    @DeleteDateColumn({ type:'timestamp', name:'quarto_exclusao', nullable: true  })
    quarto_exclusao: Date;
}
