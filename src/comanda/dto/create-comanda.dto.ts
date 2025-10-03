import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { OneToMany } from "typeorm";

export class CreateComandaDto {

   // @ApiProperty({ example: 'Murilo' })
   // @IsString()
   // @IsNotEmpty()
   // // @OneToMany()
   // usuario_codigo: string;

   // @ApiProperty({ example: 1 })
   // @IsInt()
   // @IsNotEmpty()
   // // @OneToMany()
   // quarto_id: number;

   @ApiProperty({ example: 23 })
   @IsInt()
   @IsNotEmpty()
   // @OneToMany()
   movimentacao_id: number;

   // @ApiProperty({ example: 58801 })
   // @IsInt()
   // produto_id: number;

   @ApiProperty({ example: 3 })
   @IsInt()
   comanda_qtde: number;

   @ApiProperty({ example: 'Murilo' })
   @IsString()
   @IsOptional()
   comanda_observacao: string;
}
