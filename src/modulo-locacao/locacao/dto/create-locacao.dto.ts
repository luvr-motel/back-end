import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNumber, IsOptional } from "class-validator";
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
    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsInt()
    motel_id?: number;

    @ApiProperty({ example: 10 })
    @IsOptional()
    @IsInt()
    quarto_id?: number;

    @ApiProperty({ example: 5 })
    @IsOptional()
    @IsInt()
    pessoa_id?: number;

    @ApiProperty({ example: 2 })
    @IsOptional()
    @IsInt()
    pagamentoforma_id?: number;

    @ApiProperty({ example: 3 })
    @IsOptional()
    @IsInt()
    usuario_id?: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsInt()
    locacaoPosicao_id?: number;

    @ApiProperty({ example: 1 })
    @IsOptional()
    @IsInt()
    locacaoTipo_id?: number;

}
