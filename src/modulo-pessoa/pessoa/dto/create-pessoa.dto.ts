import { IsInt, IsNotEmpty, IsString, MaxLength, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePessoaDto {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString({ message: 'pessoa_nome deve ser uma string.' })
  @IsNotEmpty()
  @MaxLength(255)
  pessoa_nome: string;

  @ApiProperty({ example: '12345678901' })
  @IsString({ message: 'pessoa_cpf deve ser uma string' })
  pessoa_cpf: string;

  @ApiProperty({ example: '44999998888'})
  @IsString({ message: 'pessoa_telefone deve ser uma string.' })
  pessoa_telefone: string;

  @ApiProperty({ example: 1 })//verificar se esta relacionando
  @IsInt()
  pessoatipo_id: number;
}
