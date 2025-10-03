import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Locacao {

    @PrimaryGeneratedColumn({ type: 'integer', name: 'locacao_id' })
    locacao_id: number;

    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalItens', nullable: false  })
    locacao_totalItens: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalQuarto', nullable: false  })
    locacao_totalQuarto: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalDesconto', nullable: false  })
    locacao_totalDesconto: number;
    
    @Column({ type:'numeric', precision: 10, scale: 2 , name:'locacao_totalLocacao', nullable: false  })
    locacao_totalLocacao: number;
  
    // quarto_id             integer
    // pessoa_id             integer 
    // pagamentoforma_id     integer
    // usuario_id            integer
    // locacaoPosicao_id     integer

    @CreateDateColumn({type:'timestamp', name: 'locacao_inclusao'})
    locacao_inclusao: Date;
    
    @DeleteDateColumn({ type:'timestamp', name:'locacao_exclusao', nullable: true  })
    locacao_exclusao: Date;    

}

