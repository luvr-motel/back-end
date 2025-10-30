import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'Rodrigo' })
  @IsString() 
  @IsNotEmpty()
  usuarioCodigo: string;

  @ApiProperty({ example: 'luvr#123' })
  @IsString() 
  @MinLength(8)
  senha: string;
}

