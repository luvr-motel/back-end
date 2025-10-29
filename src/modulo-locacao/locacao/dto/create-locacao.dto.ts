import { ApiProperty } from "@nestjs/swagger";
import { IsCurrency, IsDate, IsInt, IsNumber, IsOptional } from "class-validator";
// DTO não deve declarar relacionamentos; manter apenas campos de entrada

export class CreateLocacaoDto {

    @ApiProperty({ example: 129.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    locacao_totalItens: number;
    
    @ApiProperty({ example: 240.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    locacao_totalQuarto: number;
    
    @ApiProperty({ example: 20.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    locacao_totalDesconto: number;
    
    @ApiProperty({ example: 349.00 })
    @IsOptional()
    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    locacao_totalLocacao: number;

    // relacionamentos são definidos na entidade, não no DTO
    // quarto_id             integer
    // pessoa_id             integer 
    // pagamentoforma_id     integer
    // usuario_id            integer
    // locacaoPosicao_id     integer

}
