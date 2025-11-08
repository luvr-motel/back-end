import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Locacao } from "../../locacao/entities/locacao.entity";

@Entity({ name: 'locacao_posicao' })
export class LocacaoPosicao {

   @PrimaryGeneratedColumn({ type: 'integer', name: 'locacaoPosicao_id' })
   locacaoPosicao_id: number;

   @Column({ type: 'varchar', name: 'locacaoPosicao_descricao', nullable: false })
   locacaoPosicao_descricao: string;

   // Relacionamento reverso com Locacao
   @OneToMany(() => Locacao, (locacao) => locacao.locacaoPosicao)
   locacoes: Locacao[];
   
   @CreateDateColumn({ type: 'timestamp', name: 'locacaoPosicao_inclusao' })
   locacaoPosicao_inclusao: Date;

   @DeleteDateColumn({ type: 'timestamp', name: 'locacaoPosicao_exclusao', nullable: true })
   locacaoPosicao_exclusao: Date;

}
