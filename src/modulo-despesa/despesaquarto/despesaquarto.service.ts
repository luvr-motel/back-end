import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDespesaquartoDto } from './dto/create-despesaquarto.dto';
import { UpdateDespesaquartoDto } from './dto/update-despesaquarto.dto';
import { Despesaquarto } from './entities/despesaquarto.entity';
import { Quarto } from '../../modulo-quarto/quarto/entities/quarto.entity';
import { Motel } from '../../modulo-motel/motel/entities/motel.entity';

@Injectable()
export class DespesaquartoService {
  constructor(
    @InjectRepository(Despesaquarto)
    private readonly despesaquartoRepository: Repository<Despesaquarto>,
  ) {}

  async createDespesaquarto(createDespesaquartoDto: CreateDespesaquartoDto,): Promise<Despesaquarto> {
    const despesaquarto = this.despesaquartoRepository.create({
      despesaquarto_descricao: createDespesaquartoDto.despesaquarto_descricao,
      despesaquarto_parcela: createDespesaquartoDto.despesaquarto_parcela ?? null,
      despesaquarto_itens: createDespesaquartoDto.despesaquarto_itens,
      despesatipo_id: createDespesaquartoDto.despesatipo_id ?? null,
      pessoa_id: createDespesaquartoDto.pessoa_id ?? null,
      usuario_id: createDespesaquartoDto.usuario_id,
      motel: { motel_id: createDespesaquartoDto.motel_id } as Motel,
      quarto: { quarto_id: createDespesaquartoDto.quarto_id } as Quarto,
    });

    return this.despesaquartoRepository.save(despesaquarto);
  }

  async findAllDespesasQuarto(): Promise<Despesaquarto[]> {
    return this.despesaquartoRepository.find({
      relations: ['quarto', 'motel'],
    });
  }

  async findDespesaquartoId(
    despesaquarto_id: number,
  ): Promise<{ mensagem: string; despesaquarto: Despesaquarto }> {
    const despesaquarto = await this.despesaquartoRepository.findOne({
      where: { despesaquarto_id },
      relations: ['quarto', 'motel'],
    });

    if (!despesaquarto) {
      throw new HttpException('Despesaquarto não encontrada', 404);
    } else {
      return {
        mensagem: `Despesaquarto #${despesaquarto_id}`,
        despesaquarto,
      };
    }
  }
  async updateDespesaquarto(despesaquarto_id: number,updateDespesaquartoDto: UpdateDespesaquartoDto,): Promise<{ mensagem: string; despesaquarto: Despesaquarto }> {
    const despesaquartoAtual = await this.despesaquartoRepository.findOne({where: { despesaquarto_id },});

    if (!despesaquartoAtual) {
      throw new HttpException('Erro ao atualizar despesaquarto', 404);
    } else {
      const despesaquartoAtualizado = this.despesaquartoRepository.merge(
        despesaquartoAtual,
        updateDespesaquartoDto,
      );
      const despesaquartoSalvo =
        await this.despesaquartoRepository.save(despesaquartoAtualizado);

      return {
        mensagem: `Despesaquarto #${despesaquarto_id} atualizada com sucesso`,
        despesaquarto: despesaquartoSalvo,
      };
    }
  }


  async removeDespesaquarto(
    despesaquarto_id: number,
  ): Promise<{ mensagem: string }> {
    const despesaquarto = await this.despesaquartoRepository.findOne({
      where: { despesaquarto_id },
    });

    if (!despesaquarto) {
      throw new HttpException('Erro ao excluir despesaquarto', 404);
    } else {
      await this.despesaquartoRepository.softDelete(despesaquarto_id);
      return {
        mensagem: `Despesaquarto #${despesaquarto_id} excluída com sucesso`,
      };
    }
  }
}
