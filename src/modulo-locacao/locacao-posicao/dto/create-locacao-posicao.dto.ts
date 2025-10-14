import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateLocacaoPosicaoDto {

   @IsString()
   @ApiProperty({ example: 'Ocupado '})
   locacaoPosicao_descricao: string;
   
}
