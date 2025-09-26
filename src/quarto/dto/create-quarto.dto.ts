import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateQuartoDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @ApiPropertyOptional({ example: 'Suíte 101', maxLength: 256 })
    quarto_descricao : string;

    @IsString()
    @ApiPropertyOptional({ example: '', maxLength: 256 })
    quarto_atributos: string;

    @IsBoolean()
    @ApiPropertyOptional({ type: Boolean, example: true })
    quarto_ativo: boolean;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    quartotipo_id: number;  
}