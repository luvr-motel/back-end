import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('quarto')
export class Quarto {
    @PrimaryGeneratedColumn()
    quarto_id: number;

    @Column({ length: 256 })
    quarto_descricao: string;

    @Column({ type: 'varchar', nullable: true })
    quarto_atributos:string;

    @Column({ type: 'boolean', default: false })
    quarto_ativo: boolean;

    @Column()
    quartotipo_id: number;
}