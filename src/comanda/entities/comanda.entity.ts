import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comanda {
   @PrimaryGeneratedColumn({ type: 'integer', name: 'comanda_id' })
   comanda_id: number;

   // @Column({type: 'varchar', name: 'usuario_codigo', nullable: true})
   // usuario_codigo: string;
   
   // @Column({ type: 'integer', name: 'quarto_id' })
   // quarto_id: number;

   // @Column({type:'integer', name: 'locacao_id '})
   // locacao_id: number;

   // @Column({type:'integer', name: 'produto_id'})
   // produto_id: number;

   @Column({ type:'numeric', precision: 10, scale: 2 , name: 'comanda_qtde', nullable: false })
   comanda_qtde: number;

   @Column({ type: 'varchar', name: 'comanda_observacao', nullable: true })
   comanda_observacao: string;   

   @CreateDateColumn({ type:'timestamp', name: 'comanda_inclusao' })
   comanda_inclusao: Date;

   @DeleteDateColumn({ type:'timestamp', name:'comanda_exclusao', nullable: true })
   comanda_exclusao: Date;

}
