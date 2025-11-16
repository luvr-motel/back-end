import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Locacao } from "../../locacao/entities/locacao.entity";

@Entity({ name: 'locacao_tipo' })
export class LocacaoTipo {
   @PrimaryGeneratedColumn({type:'integer', name: 'locacaoTipo_id'})
   locacaoTipo_id : number;
   
   @Column({type: 'varchar', name:'locacaoTipo_descricao', nullable: false })
   locacaoTipo_descricao: string;

   @Column({ type: 'numeric', precision: 10, scale: 2, name: 'locacaoTipo_valor', nullable: false })
   locacoTipo_valor: number;

   @OneToMany(() => Locacao, (locacao) => locacao.locacaoTipo)
   locacoes: Locacao[];
   
   @CreateDateColumn({ type: 'timestamp', name:'locacaoTipo_inclusao'})
   locacaoTipo_inclusao: Date;
   
   @DeleteDateColumn({type:'timestamp', name:'locacaoTipo_exclusao', nullable: true})
   locacaoTipo_exclusao: Date;

}
