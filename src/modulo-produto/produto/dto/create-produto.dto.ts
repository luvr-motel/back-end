import {    IsBoolean, IsCurrency, IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength  } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateProdutoDto {
    
    @ApiProperty({ example: "Coca-cola", maxLength:255 })
    @IsString()
    @IsNotEmpty()
    @MaxLength( 255 )
    produto_descricao: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    @IsNotEmpty()
    @ApiProperty({ example: 1.10 })
    produto_custo: number;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    @ApiProperty({ example: 3.50 })
    @IsOptional()
    produto_venda: number

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    @ApiProperty({ example: 1 })
    @IsOptional()
    produto_marckup: number
}


