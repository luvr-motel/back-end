import { HttpException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DespesaquartoService } from './despesaquarto.service';
import { Despesaquarto } from './entities/despesaquarto.entity';
import { CreateDespesaquartoDto } from './dto/create-despesaquarto.dto';
import { UpdateDespesaquartoDto } from './dto/update-despesaquarto.dto';

type MockRepository = Partial<
  Record<
    keyof Pick<
      Repository<Despesaquarto>,
      'create' | 'save' | 'find' | 'findOne' | 'merge' | 'softDelete'
    >,
    jest.Mock
  >
>;

const createMockRepository = (): MockRepository => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  merge: jest.fn(),
  softDelete: jest.fn(),
});

describe('DespesaquartoService', () => {
  let service: DespesaquartoService;
  let repository: MockRepository;

  beforeEach(() => {
    repository = createMockRepository();
    service = new DespesaquartoService(
      repository as unknown as Repository<Despesaquarto>,
    );
  });

  describe('createDespesaquarto', () => {
    it('deve criar uma despesa de quarto com os relacionamentos corretos', async () => {
      const dto: CreateDespesaquartoDto = {
        despesaquarto_descricao: 'Manutenção do ar-condicionado',
        despesaquarto_parcela: 2,
        despesaquarto_itens: 'Filtro, gás',
        despesatipo_id: 1,
        pessoa_id: 3,
        usuario_id: 5,
        motel_id: 7,
        quarto_id: 9,
      };
      const entity = { despesaquarto_id: 1 } as Despesaquarto;
      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue({
        ...entity,
        ...dto,
      });

      const result = await service.createDespesaquarto(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          despesaquarto_descricao: dto.despesaquarto_descricao,
          despesaquarto_parcela: dto.despesaquarto_parcela,
          despesaquarto_itens: dto.despesaquarto_itens,
          despesatipo_id: dto.despesatipo_id,
          pessoa_id: dto.pessoa_id,
          usuario_id: dto.usuario_id,
          motel: { motel_id: dto.motel_id },
          quarto: { quarto_id: dto.quarto_id },
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(entity);
      expect(result).toMatchObject({ despesaquarto_id: 1 });
    });

    it('deve usar null para campos opcionais quando não informados (nullish coalescing)', async () => {
      const dto = {
        despesaquarto_descricao: 'Despesa sem campos opcionais',
        // despesaquarto_parcela omitido intencionalmente - Testa linha 20
        despesaquarto_itens: 'Item teste',
        // despesatipo_id omitido intencionalmente - Testa linha 22
        // pessoa_id omitido intencionalmente - Testa linha 23
        usuario_id: 5,
        motel_id: 7,
        quarto_id: 9,
      } as CreateDespesaquartoDto;
      const entity = { despesaquarto_id: 2 } as Despesaquarto;
      (repository.create as jest.Mock).mockReturnValue(entity);
      (repository.save as jest.Mock).mockResolvedValue(entity);

      await service.createDespesaquarto(dto);

      // Verifica que os campos opcionais foram setados como null
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          despesaquarto_parcela: null,
          despesatipo_id: null,
          pessoa_id: null,
        }),
      );
    });
  });


  describe('findAllDespesasQuarto', () => {
    it('deve retornar todas as despesas com as relações configuradas', async () => {
      const despesas = [{ despesaquarto_id: 1 }] as Despesaquarto[];
      (repository.find as jest.Mock).mockResolvedValue(despesas);

      const result = await service.findAllDespesasQuarto();

      expect(repository.find).toHaveBeenCalledWith({
        relations: ['quarto', 'motel'],
      });
      expect(result).toEqual(despesas);
    });
  });

  describe('findDespesaquartoId', () => {
    it('deve retornar a despesa quando encontrada', async () => {
      const despesa = { despesaquarto_id: 1 } as Despesaquarto;
      (repository.findOne as jest.Mock).mockResolvedValue(despesa);

      const result = await service.findDespesaquartoId(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { despesaquarto_id: 1 },
        relations: ['quarto', 'motel'],
      });
      expect(result).toEqual({
        mensagem: 'Despesaquarto #1',
        despesaquarto: despesa,
      });
    });

    it('deve lançar exceção quando não encontrar a despesa', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.findDespesaquartoId(99)).rejects.toThrow(
        HttpException,
      );
    });
  });

  describe('updateDespesaquarto', () => {
    it('deve atualizar uma despesa existente', async () => {
      const despesaAtual = { despesaquarto_id: 1 } as Despesaquarto;
      const dto: UpdateDespesaquartoDto = {
        despesaquarto_descricao: 'Atualizada',
      };
      const mergeResult = { ...despesaAtual, ...dto } as Despesaquarto;

      (repository.findOne as jest.Mock).mockResolvedValue(despesaAtual);
      (repository.merge as jest.Mock).mockReturnValue(mergeResult);
      (repository.save as jest.Mock).mockResolvedValue(mergeResult);

      const result = await service.updateDespesaquarto(1, dto);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { despesaquarto_id: 1 },
      });
      expect(repository.merge).toHaveBeenCalledWith(despesaAtual, dto);
      expect(repository.save).toHaveBeenCalledWith(mergeResult);
      expect(result).toEqual({
        mensagem: 'Despesaquarto #1 atualizada com sucesso',
        despesaquarto: mergeResult,
      });
    });

    it('deve lançar exceção se a despesa não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        service.updateDespesaquarto(1, { despesaquarto_descricao: 'X' }),
      ).rejects.toThrow('Erro ao atualizar despesaquarto');
    });
  });

  describe('removeDespesaquarto', () => {
    it('deve remover uma despesa existente', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue({
        despesaquarto_id: 1,
      } as Despesaquarto);
      (repository.softDelete as jest.Mock).mockResolvedValue(undefined);

      const result = await service.removeDespesaquarto(1);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { despesaquarto_id: 1 },
      });
      expect(repository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual({
        mensagem: 'Despesaquarto #1 excluída com sucesso',
      });
    });

    it('deve lançar exceção se a despesa não existir', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(service.removeDespesaquarto(1)).rejects.toThrow(
        'Erro ao excluir despesaquarto',
      );
    });
  });
});
