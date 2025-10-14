import { IsNotEmpty, IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsuarioStatus } from '../entities/usuario.entity'; // (ideal: mover p/ usuario-status.enum.ts)
import { UsuarioRole } from '../entities/usuario-role.enum';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'max.v', description: 'Código único de login do usuário.' })
  @IsString()
  @IsNotEmpty()
  usuarioCodigo: string;

  @ApiProperty({ example: 'MUNDIAL2012CORINTHIANS', description: 'Senha em texto plano (será hasheada no servidor).' })
  @IsString()
  @IsNotEmpty()
  usuarioSenha: string;

  @ApiPropertyOptional({ enum: UsuarioStatus, example: UsuarioStatus.ATIVO, description: 'Padrão ATIVO se omitido.' })
  @IsEnum(UsuarioStatus)
  usuarioAtivo?: UsuarioStatus;

  @ApiPropertyOptional({ example: 7, type: Number, description: 'ID da Pessoa vinculada.' })
  @IsOptional()
  @IsInt()
  pessoaId?: number;

  @ApiPropertyOptional({ example: 3, type: Number, description: 'ID do Motel (quando habilitado).' })
  @IsOptional()
  @IsInt()
  motelId?: number;

  @ApiPropertyOptional({ enum: UsuarioRole, example: 'recepcionista', description: 'Papel do usuário.' })
  @IsEnum(UsuarioRole)
  usuarioRole?: UsuarioRole;
}
