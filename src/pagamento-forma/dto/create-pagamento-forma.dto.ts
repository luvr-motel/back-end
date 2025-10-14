import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsString } from "class-validator"

export class CreatePagamentoFormaDto {

   @IsString()
   @IsNotEmpty()
   @ApiProperty({ example: 'PIX' })
   pagamentoforma_descricao: string;    

   @IsString()
   @IsNotEmpty()
   @ApiProperty({ example: '1078-x' })
   pagamentoforma_contaDestino: string;

}
