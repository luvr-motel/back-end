import { IsNotEmpty, IsString, IsInt, IsEnum, IsArray, IsOptional } from 'class-validator';
import { Transform /*, Type*/ } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UsuarioStatus } from '../entities/usuario.entity';
import { UsuarioRole } from '../entities/usuario-role.enum';

function normalizeRoles(v: unknown): string[] | undefined {
  if (v == null) return undefined;
  const arr = Array.isArray(v) ? v : String(v).trim().split(',');
  const cleaned = arr
    .map(x => String(x).trim())
    .filter(Boolean)
    .map(x => x.toLowerCase());
  return cleaned.length ? Array.from(new Set(cleaned)) : undefined;
}

export class CreateUsuarioDto {
  @ApiProperty({
    example: 'Max Verstappen',
    description: 'Código único de login do usuário.',
  })
  @IsString()
  @IsNotEmpty()
  usuarioCodigo: string;

  @ApiProperty({
    example: 'MUNDIAL2012CORINTHIANS',
    description: 'Senha em texto plano (será hasheada no servidor).',
  })
  @IsString()
  @IsNotEmpty()
  usuarioSenha: string;

  @ApiPropertyOptional({
    enum: UsuarioStatus,
    example: UsuarioStatus.ATIVO,
    description: 'Status do usuário (padrão ATIVO se omitido).',
  })
  @IsOptional()
  @IsEnum(UsuarioStatus)
  usuarioAtivo?: UsuarioStatus;

  @ApiPropertyOptional({
    example: 7,
    type: Number,
    description: 'ID da Pessoa vinculada.',
  })
  @IsOptional()
  @IsInt()
  pessoaId?: number;

  @ApiPropertyOptional({
    example: 3,
    type: Number,
    description: 'ID do Motel (quando o módulo estiver habilitado).',
  })
  @IsOptional()
  @IsInt()
  motelId?: number;

  @ApiPropertyOptional({
    isArray: true,
    enum: UsuarioRole,
    example: ['admin', 'gerente'],
    description:
      'Perfis do usuário. Aceita array ou string separada por vírgula; normalizado para minúsculas.',
  })
  @IsOptional()
  @IsArray()
  @IsEnum(UsuarioRole, { each: true })
  @Transform(({ value }) => normalizeRoles(value))
  roles?: UsuarioRole[];

  @ApiPropertyOptional({
    enum: UsuarioRole,
    example: 'recepcionista',
    description: 'Perfil único (alternativa a roles[]).',
  })
  @IsOptional()
  @IsEnum(UsuarioRole)
  usuarioRole?: UsuarioRole;
}
