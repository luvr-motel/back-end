import { Column, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from "typeorm";

export class LocacaoTipo {
   @PrimaryGeneratedColumn({type:'integer', name: 'locacaoTipo_id'})
   locacaoTipo_id : number;
   
   @Column({type: 'varchar', name:'locacaoTipo_descricao'})
   locacaoTipo_descricao: string;
   
   @CreateDateColumn({ type: 'timestamp', name:'locacaoTipo_inclusao'})
   locacaoTipo_inclusao: Date;
   
   @DeleteDateColumn({type:'timestamp', name:'locacaoTipo_exclusao'})
   locacaoTipo_exclusao: Date;

}
