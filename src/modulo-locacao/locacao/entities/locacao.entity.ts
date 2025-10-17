import { Quarto } from "./Quarto";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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
    
    @OneToOne(() => Quarto, (quarto) => quarto.locacao )
    @JoinColumn()
    Quarto: Quarto


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

//   locacao_id            integer [primary key]
//   locacao_totalItens    float//count do itemCOmanda
//   locacao_totalQuarto   float//soma das horas contratadas
//   locacao_totalDEsconto float//aplicado algum desconto?
//   locacao_totalLocacao  float//total geral
//   quarto_id             integer
//   pessoa_id             integer 
//   pagamentoforma_id     integer//foi pago como?
//   usuario_id            integer
//   locacaoPosicao_id     integer//posicao da locação ( em uso...)
//   motel_id              integer
//   locacao_inclusao      timestamp
//   locacao_exclusao      timestamp