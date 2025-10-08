import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateLocacaoTipoDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Super Luxo' })
    locacaoTipo_descricao: string;
   } 
