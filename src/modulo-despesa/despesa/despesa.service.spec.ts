import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DespesaService } from './despesa.service';
import { Despesa } from './entities/despesa.entity';
import { CreateDespesaDto } from './dto/create-despesa.dto';
import { UpdateDespesaDto } from './dto/update-despesa.dto';

const createMockRepository = () =>
  ({
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    softDelete: jest.fn(),
  }) as unknown as jest.Mocked<Partial<Repository<Despesa>>>;

describe('DespesaService', () => {
  let despesaService: DespesaService;
  let despesaRepository: jest.Mocked<Partial<Repository<Despesa>>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DespesaService,
        {
          provide: getRepositoryToken(Despesa),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    despesaService = module.get<DespesaService>(DespesaService);
    despesaRepository = module.get(getRepositoryToken(Despesa));
  });

  describe('createDespesa', () => {
    it('deve criar e salvar uma despesa', async () => {
      const createDto: CreateDespesaDto = {
        despesa_descricao: 'Hospedagem equipe comercial',
        despesa_parcela: 2,
        despesa_aberto: true,
        despesa_total: 1250.75,
        despesatipo_id: 1,
        pessoa: 5,
        usuario_id: 7,
        motel_id: 3,
      };

      const entidadeCriada = {
        despesa_id: 1,
        despesa_descricao: createDto.despesa_descricao,
      } as Despesa;

      (despesaRepository.create as jest.Mock).mockReturnValue(entidadeCriada);
      (despesaRepository.save as jest.Mock).mockResolvedValue(entidadeCriada);

      const resultado = await despesaService.createDespesa(createDto);

      expect(despesaRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          despesa_descricao: createDto.despesa_descricao,
          despesa_parcela: createDto.despesa_parcela,
          despesa_aberto: createDto.despesa_aberto,
          despesa_total: createDto.despesa_total,
          despesatipo: { despesatipo_id: createDto.despesatipo_id },
          pessoa: { pessoa_id: createDto.pessoa },
          usuario: { usuario_id: createDto.usuario_id },
          motel: { motel_id: createDto.motel_id },
        }),
      );
      expect(despesaRepository.save).toHaveBeenCalledWith(entidadeCriada);
      expect(resultado).toBe(entidadeCriada);
    });

    it('deve permitir criar despesa sem pessoa e usuario', async () => {
      const createDto: CreateDespesaDto = {
        despesa_descricao: 'Despesa sem vínculos',
        despesa_parcela: 0,
        despesa_aberto: false,
        despesa_total: 500,
        despesatipo_id: 2,
        pessoa: null,
        usuario_id: null,
        motel_id: 4,
      };

      const entidadeCriada = { despesa_id: 2 } as Despesa;
      (despesaRepository.create as jest.Mock).mockReturnValue(entidadeCriada);
      (despesaRepository.save as jest.Mock).mockResolvedValue(entidadeCriada);

      await despesaService.createDespesa(createDto);

      expect(despesaRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          pessoa: undefined,
          usuario: undefined,
        }),
      );
    });

    it('deve usar null para despesa_parcela quando não informado (nullish coalescing)', async () => {
      const createDto: CreateDespesaDto = {
        despesa_descricao: 'Despesa sem parcela',
        despesa_parcela: undefined,
        despesa_aberto: true,
        despesa_total: 300,
        despesatipo_id: 3,
        pessoa: 1,
        usuario_id: 2,
        motel_id: 5,
      };

      const entidadeCriada = { despesa_id: 3 } as Despesa;
      (despesaRepository.create as jest.Mock).mockReturnValue(entidadeCriada);
      (despesaRepository.save as jest.Mock).mockResolvedValue(entidadeCriada);

      await despesaService.createDespesa(createDto);

      // Verifica que despesa_parcela foi setado como null
      expect(despesaRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          despesa_parcela: null,
        }),
      );
    });
  });


  describe('findAllDespesas', () => {
    it('deve retornar todas as despesas com relações', async () => {
      const despesas = [{ despesa_id: 1 }] as Despesa[];
      (despesaRepository.find as jest.Mock).mockResolvedValue(despesas);

      const resultado = await despesaService.findAllDespesas();

      expect(despesaRepository.find).toHaveBeenCalledWith({
        relations: ['despesatipo'],
      });
      expect(resultado).toBe(despesas);
    });
  });

  describe('findDespesaId', () => {
    it('deve retornar a despesa quando encontrada', async () => {
      const despesa = { despesa_id: 10 } as Despesa;
      (despesaRepository.findOne as jest.Mock).mockResolvedValue(despesa);

      const resultado = await despesaService.findDespesaId(10);

      expect(despesaRepository.findOne).toHaveBeenCalledWith({
        where: { despesa_id: 10 },
        relations: ['despesatipo'],
      });
      expect(resultado).toEqual({
        mensagem: 'Despesa #10',
        despesa,
      });
    });

    it('deve lançar exceção quando despesa não encontrada', async () => {
      (despesaRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(despesaService.findDespesaId(99)).rejects.toThrow(
        'Despesa não encontrada',
      );
    });
  });

  describe('updateDespesa', () => {
    it('deve atualizar uma despesa existente', async () => {
      const despesaExistente = { despesa_id: 1, despesa_descricao: 'Antigo' } as Despesa;
      const despesaAtualizada = { despesa_id: 1, despesa_descricao: 'Atualizado' } as Despesa;
      const updateDto: UpdateDespesaDto = { despesa_descricao: 'Atualizado' };

      (despesaRepository.findOne as jest.Mock).mockResolvedValue(despesaExistente);
      (despesaRepository.merge as jest.Mock).mockReturnValue(despesaAtualizada);
      (despesaRepository.save as jest.Mock).mockResolvedValue(despesaAtualizada);

      const resultado = await despesaService.updateDespesa(1, updateDto);

      expect(despesaRepository.merge).toHaveBeenCalledWith(despesaExistente, updateDto);
      expect(despesaRepository.save).toHaveBeenCalledWith(despesaAtualizada);
      expect(resultado).toEqual({
        mensagem: 'Despesa #1 atualizada com sucesso',
        despesa: despesaAtualizada,
      });
    });

    it('deve lançar exceção quando despesa para atualização não existe', async () => {
      (despesaRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        despesaService.updateDespesa(1, { despesa_descricao: 'Novo' }),
      ).rejects.toThrow('Erro ao atualizar despesa');
    });
  });

  describe('removeDespesa', () => {
    it('deve remover uma despesa existente', async () => {
      (despesaRepository.findOne as jest.Mock).mockResolvedValue({ despesa_id: 1 } as Despesa);
      (despesaRepository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const resultado = await despesaService.removeDespesa(1);

      expect(despesaRepository.softDelete).toHaveBeenCalledWith(1);
      expect(resultado).toEqual({ mensagem: 'Despesa #1 excluída com sucesso' });
    });

    it('deve lançar exceção quando despesa para exclusão não existe', async () => {
      (despesaRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(despesaService.removeDespesa(1)).rejects.toThrow(
        'Erro ao excluir despesa',
      );
    });
  });
});
