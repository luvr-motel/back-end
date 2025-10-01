import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Locacao {

    @PrimaryGeneratedColumn({ type: 'integer', name: 'locacao_id' })
    locacao_id: number;

    @Column({ type:'float', name:'locacao_totalItens' })
    locacao_totalItens: number;
    
    @Column({ type:'float', name:'locacao_totalQuarto' })
    locacao_totalQuarto: number;
    
    @Column({ type:'float', name:'locacao_totalDesconto' })
    locacao_totalDesconto: number;
    
    @Column({ type:'float', name:'locacao_totalLocacao' })
    locacao_totalLocacao: number;
  
    // quarto_id             integer
    // pessoa_id             integer 
    // pagamentoforma_id     integer
    // usuario_id            integer
    // locacaoPosicao_id     integer

    @CreateDateColumn({type:'timestamp', name: 'locacao_inclusao'})
    locacao_inclusao: Date;
    
    @Column({ type:'timestamp', name:'locacao_exclusao' })
    locacao_exclusao: Date;    

}

