import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreatePagamentoFormaDto {

   @IsString()
   @IsNotEmpty()
   @ApiProperty({ example: 'PIX' })
   pagamentoForma_descricao: string; 

   @IsString()
   @IsNotEmpty()
   @ApiProperty({ example: '1078-x' })
   pagamentoForma_contaDestino: string;

}
