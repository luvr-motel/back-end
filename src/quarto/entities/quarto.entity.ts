import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('quarto')
export class Quarto {
    @PrimaryGeneratedColumn()
    quarto_id: number;

    @Column()
    quarto_descricao: string;

    @Column()
    quarto_atributos:string;

    @Column()
    quarto_ativo: boolean;

    @Column()
    quartotipo_id: string;

    

}
// table quarto {
//   quarto_id        integer [primary key]
//   quarto_descricao varchar [not null]
//   quarto_atributos varchar [not null] // array
//   quarto_ativo     status
//   quartotipo_id    integer
//   quarto_inclusao  timestamp // default_timestamp
//   quarto_exclusao  timestampa