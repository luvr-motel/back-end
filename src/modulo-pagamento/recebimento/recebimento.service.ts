import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecebimentoDto } from './dto/create-recebimento.dto';
import { UpdateRecebimentoDto } from './dto/update-recebimento.dto';
import { Recebimento } from './entities/recebimento.entity';
import { Motel } from '../../modulo-motel/motel/entities/motel.entity';

@Injectable()
export class RecebimentoService {
  constructor(
    @InjectRepository(Recebimento)
    private readonly recebimentoRepository: Repository<Recebimento>,
  ) {}

  async createRecebimento(
    recebimentoDto: CreateRecebimentoDto,
  ): Promise<Recebimento> {
    const recebimento = this.recebimentoRepository.create({
      recebimento_descricao: recebimentoDto.recebimento_descricao,
      recebimento_total: recebimentoDto.recebimento_total,
      motel_id: recebimentoDto.motel_id
        ? ({ motel_id: recebimentoDto.motel_id } as Motel)
        : undefined,
    });

    return this.recebimentoRepository.save(recebimento);
  }

  async findAllRecebimento(): Promise<Recebimento[]> {
    return this.recebimentoRepository.find({
      relations: ['pagamentoforma_id', 'motel_id'],
    });
  }

  async findRecebimentoById(id: number,): Promise<{ mensagem: string; recebimento: Recebimento }> {
    const recebimentoData = await this.recebimentoRepository.findOne({where: { recebimento_id: id },
      relations: ['pagamentoforma_id', 'motel_id'],
    });

    if (!recebimentoData) {
      throw new HttpException('Recebimento não encontrado', 404);
    } else {
      return {
        mensagem: `Recebimento #${id} encontrado com sucesso`,
        recebimento: recebimentoData,
      };
    }
  }

  async updateRecebimentoById(id: number,updateRecebimentoDto: UpdateRecebimentoDto,): Promise<{ mensagem: string; recebimento: Recebimento }> {
    const recebimentoData = await this.recebimentoRepository.findOne({
      where: { recebimento_id: id },
      relations: ['pagamentoforma_id', 'motel_id'],
    });

    if (!recebimentoData) {
      throw new HttpException('Erro ao atualizar recebimento', 404);
    } else {
      const { motel_id, ...restoAtualizacao } = updateRecebimentoDto;
      const recebimentoAtualizado = this.recebimentoRepository.merge(
        recebimentoData,
        restoAtualizacao as Partial<Recebimento>,
      );

      if (motel_id) {
        recebimentoAtualizado.motel_id = { motel_id } as Motel;
      }

      const recebimentoSave = await this.recebimentoRepository.save(
        recebimentoAtualizado,
      );

      return {
        mensagem: 'Recebimento atualizado com sucesso!',
        recebimento: recebimentoSave,
      };
    }
  }

  async deleteRecebimento(id: number,): Promise<{ mensagem: string; recebimento: Recebimento }> {
    const recebimento = await this.recebimentoRepository.findOne({
      where: { recebimento_id: id },
    });

    if (!recebimento) {
      throw new HttpException('Erro ao excluir recebimento', 404);
    } else {
      await this.recebimentoRepository.softDelete(id);

      return {
        mensagem: 'Recebimento excluído com sucesso!',
        recebimento,
      };
    }
  }
}
