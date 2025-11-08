import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateRecebimentoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Recebimento referente ao período X' })
  recebimento_descricao: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'O valor deve ser numérico com até 2 casas decimais' })
  @IsNotEmpty()
  @ApiProperty({ example: 1500.75 })
  recebimento_total: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({ example: 1, required: false })
  motel_id?: number;
}
