import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, maxLength } from "class-validator";

export class CreateComandaDto {

   @ApiProperty({ example: 'Murilo' })
   @IsString()
   @IsNotEmpty()
   usuario_codigo: String;

   @ApiProperty({ example: 1 })
   @IsInt()
   @IsNotEmpty()
   quarto_id: number;

   @ApiProperty({ example: 23 })
   @IsInt()
   @IsNotEmpty()
   movimentacao_id: number;

   @ApiProperty({ example: 58801 })
   @IsInt()
   produto_id: number;

   @ApiProperty({ example: 3 })
   @IsInt()
   comanda_qtde: number;

   @ApiProperty({ example: 'Murilo' })
   @IsString()
   @IsOptional()s
   comanda_observacao: string;
}
