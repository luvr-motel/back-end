// src/modulo-pessoa/usuario/dto/create-usuario.dto.spec.ts
import { validate } from 'class-validator';
import { CreateUsuarioDto } from './create-usuario.dto';
import { UsuarioStatus } from '../entities/usuario.entity';
import { UsuarioRole } from '../entities/usuario-role.enum';

describe('CreateUsuarioDto (validação)', () => {
  it('deve validar DTO correto (todos obrigatórios preenchidos)', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'LUVR.RODRIGO';
    dto.usuarioSenha = 'luvr#123';
    dto.usuarioAtivo = UsuarioStatus.ATIVO; // obrigatório
    dto.pessoaId = 1;                        // opcional, mas válido
    dto.motel_id = 2;                        // opcional, mas válido
    dto.usuarioRole = UsuarioRole.GERENTE;   // opcional, mas válido

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar se usuarioCodigo estiver vazio', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = ''; // inválido
    dto.usuarioSenha = '123';
    dto.usuarioAtivo = UsuarioStatus.ATIVO;

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioCodigo')).toBe(true);
  });

  it('deve falhar se usuarioSenha não for string', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'USER';
    (dto as any).usuarioSenha = 1234; // força tipo errado
    dto.usuarioAtivo = UsuarioStatus.ATIVO;

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioSenha')).toBe(true);
  });

  it('deve falhar se usuarioAtivo estiver ausente (é obrigatório)', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'X';
    dto.usuarioSenha = 'Y';
    // usuarioAtivo não informado

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioAtivo')).toBe(true);
  });

  it('deve falhar se usuarioAtivo tiver valor inválido (fora do enum)', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'X';
    dto.usuarioSenha = 'Y';
    (dto as any).usuarioAtivo = 'QUALQUER'; // fora do enum

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioAtivo')).toBe(true);
  });

  it('deve aceitar pessoaId e motel_id numéricos quando presentes', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'USER';
    dto.usuarioSenha = '123';
    dto.usuarioAtivo = UsuarioStatus.ATIVO;
    dto.pessoaId = 10;
    dto.motel_id = 20;

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('deve falhar se pessoaId não for número', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'USER';
    dto.usuarioSenha = '123';
    dto.usuarioAtivo = UsuarioStatus.ATIVO;
    (dto as any).pessoaId = 'abc'; // tipo errado

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'pessoaId')).toBe(true);
  });

  it('deve falhar se usuarioRole tiver valor fora do enum', async () => {
    const dto = new CreateUsuarioDto();
    dto.usuarioCodigo = 'USER';
    dto.usuarioSenha = '123';
    dto.usuarioAtivo = UsuarioStatus.ATIVO;
    (dto as any).usuarioRole = 'superadmin'; // fora do enum

    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'usuarioRole')).toBe(true);
  });
});
