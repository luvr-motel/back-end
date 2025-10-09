import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePessoaTipoDto {
  @ApiProperty({
    example: 'Funcionário',
    maxLength: 255,
    description: 'Descrição do tipo de pessoa.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  pessoatipo_descricao: string;
}
