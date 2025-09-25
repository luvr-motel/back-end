import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comanda {
   @PrimaryGeneratedColumn({ type: 'integer', name: 'comanda_id' })
   comanda_id: number;

   @Column({type: 'varchar', name: 'usuario_codigo', nullable: true})
   usuario_codigo: String;
   
   @Column({ type: 'integer', name: 'quarto_id'})
   quarto_id: number;

   @Column({type:'integer', name: 'movimentacao_id'})
   movimentacao_id: number;

   @Column({type:'integer', name: 'produto_id'})
   produto_id: number;

   @Column({type:'integer', name: 'comanda_qtde'})
   comanda_qtde: number;

   @Column({type: 'varchar', name: 'comanda_observacao'})
   comanda_observacao: string;   

   @CreateDateColumn({type:'timestamp', name: 'comanda_inclusao' })
   comandaO_inclusao: Date;
}
