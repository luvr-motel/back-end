import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { execArgv } from 'process';

export class CreateProdutoDto {
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: "Coca-cola" })
    produto_descricao: string;

    @IsInt()
    @ApiProperty({ example: 1 })
    produto_custo: number;

    @IsInt()
    @ApiProperty({ example: 3 })
    produto_venda: number
}

