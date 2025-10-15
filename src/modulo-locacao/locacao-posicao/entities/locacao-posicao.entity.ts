import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class LocacaoPosicao {

   @PrimaryGeneratedColumn({ type: 'integer', name: 'locacaoPosicao_id' })
   locacaoPosicao_id: number;

   @Column({ type: 'varchar', name: 'locacaoPosicao_descricao', nullable: false })
   locacaoPosicao_descricao: string;
   
   @CreateDateColumn({ type: 'timestamp', name: 'locacaoPosicao_inclusao' })
   locacaoPosicao_inclusao: Date;

   @DeleteDateColumn({ type: 'timestamp', name: 'locacaoPosicao_exclusao', nullable: true })
   locacaoPosicao_exclusao: Date;

}
