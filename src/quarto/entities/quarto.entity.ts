import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
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

    // @OneToMany(() => motel, (quarto) => quarto.motel)
    // @JoinColumn({ name: 'motel_id' })
    // motel_id: number;

    @CreateDateColumn({ type:'timestamp', name:'quarto_inclusao' })
    quarto_inclusao: Date;

    @DeleteDateColumn({ type:'timestamp', name:'quarto_exclusao', nullable: true  })
    quarto_exclusao: Date;
}