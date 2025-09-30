import { IsArray, IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength  } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { execArgv } from 'process';
import { exhaustMap } from 'rxjs';

export class CreateProdutoDto {
    
    @ApiProperty({ example: "Coca-cola", maxLength:255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength( 255 )
    produto_descricao: string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    produto_custo: number;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 3 })
    produto_venda: number

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({ example: 1 })
    produto_marckup: number

    @IsBoolean()
    @IsOptional()
    produto_pontaEstoque: boolean;
}

