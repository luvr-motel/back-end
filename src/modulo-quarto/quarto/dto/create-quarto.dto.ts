import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateQuartoDto {
    
    @IsString()
    @IsNotEmpty()
    @MaxLength(256)
    @ApiProperty({ example: 'Suíte 101' })
    quarto_descricao : string;

    @IsString()
    @ApiProperty({ example: 'Ar-condicionado, teto', maxLength: 256 })
    quarto_atributos: string;

    @IsBoolean()
    @ApiProperty({ type: Boolean, example: true })
    quarto_ativo: boolean;

    @IsInt()
    @IsPositive()
    @IsNotEmpty()
    @ApiProperty({ example: 1})
    quartotipo_id: number;  

    @IsInt()
    @IsPositive()
    @IsOptional()
    @ApiProperty({ example: 1})
    motel: number;
}