import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLocacaoTipoDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Super Luxo' })
    locacaoTipo_descricao: string;

    @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
    @IsNotEmpty()
    @ApiProperty({ example: 120.00 })
    locacoTIpo_valor: number;
   } 
