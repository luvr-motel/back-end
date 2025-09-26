import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { QuartoTipo } from "../../quarto_tipo/entities/quarto_tipo.entity";

@Entity('quarto')
export class Quarto {
    @PrimaryGeneratedColumn()
    quarto_id: number;

    @Column({ length: 256, default: '' })
    quarto_descricao: string;

    @Column({ type: 'varchar', nullable: true })
    quarto_atributos: string;

    @Column({ type: 'boolean', default: false })
    quarto_ativo: boolean;

    @ManyToOne(() => QuartoTipo, { eager: true, nullable: false, onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'quartotipo_id' })
    quartotipo: QuartoTipo;

    @RelationId((quarto: Quarto) => quarto.quartotipo)
    quartotipo_id: number;
}