import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateLocacaoDto {

    @ApiProperty({ example: 129.00 })
    locacao_totalItens: number;
    
    @ApiProperty({ example: 240.00 })
    locacao_totalQuarto: number;
    
    @ApiProperty({ example: 20.00 })
    locacao_totalDesconto: number;
    
    @ApiProperty({ example: 349.00 })
    locacao_totalLocacao: number;
  
    // quarto_id             integer
    // pessoa_id             integer 
    // pagamentoforma_id     integer
    // usuario_id            integer
    // locacaoPosicao_id     integer

    @IsOptional()
    locacao_exclusao: Date;   
}
