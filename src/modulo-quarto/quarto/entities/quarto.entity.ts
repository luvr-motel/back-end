import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { QuartoTipo } from "../../quarto_tipo/entities/quarto_tipo.entity";
import { Motel } from "../../../modulo-motel/motel/entities/motel.entity";

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

    @ManyToOne(() => QuartoTipo, { 
        eager: true, 
        nullable: false,
        onDelete: 'RESTRICT'})
    quartotipo: QuartoTipo;

    @RelationId((quarto: Quarto) => quarto.quartotipo)
    quartotipo_id: number;

    @ManyToOne(() => Motel, (motel) => motel.quartos, { 
        onDelete: 'RESTRICT',
        nullable: true // mudar para false     
    })
    @JoinColumn({ name: 'motel_id' })
    motel: Motel;

    @RelationId((quarto: Quarto) => quarto.motel)
    motel_id: number;

    @CreateDateColumn({ type:'timestamp', name:'quarto_inclusao' })
    quarto_inclusao: Date;

    @DeleteDateColumn({ type:'timestamp', name:'quarto_exclusao', nullable: true  })
    quarto_exclusao: Date;
} 
