import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuartoTipo } from './entities/quarto_tipo.entity';
import { CreateQuartoTipoDto } from './dto/create-quarto_tipo.dto';
import { UpdateQuartoTipoDto } from './dto/update-quarto_tipo.dto';

@Injectable()
export class QuartoTipoService {
  constructor(
    @InjectRepository(QuartoTipo)
    private readonly quartoTipoRepository: Repository<QuartoTipo>,
  ) {}

  async createQuartoTipo(createQuartoTipoDto: CreateQuartoTipoDto): Promise<QuartoTipo> {
    const quartoTipo = this.quartoTipoRepository.create({
      quartotipoDescricao: createQuartoTipoDto.quartotipo_descricao,
    });

    return this.quartoTipoRepository.save(quartoTipo);
  }

  async findAllQuartoTipos(): Promise<QuartoTipo[]> {
    return this.quartoTipoRepository.find({
      order: { quartotipoDescricao: 'ASC' },
    });
  }

  async findQuartoTipoId(quartotipoId: number): Promise<{ mensagem: string; quartotipo: QuartoTipo }> {
    const quartotipo = await this.quartoTipoRepository.findOne({
      where: { quartotipoId },
    });

    if (!quartotipo) {
      throw new HttpException('Tipo de quarto não encontrado', 404);
    }

    return {
      mensagem: `Tipo de quarto #${quartotipoId}`,
      quartotipo,
    };
  }

  async updateQuartoTipo(
    quartotipoId: number,
    updateQuartoTipoDto: UpdateQuartoTipoDto,
  ): Promise<{ mensagem: string; quartotipo: QuartoTipo }> {
    const quartotipoAtual = await this.quartoTipoRepository.findOne({
      where: { quartotipoId },
    });

    if (!quartotipoAtual) {
      throw new HttpException('Erro ao atualizar tipo de quarto', 404);
    }

    const quartotipoAtualizado = this.quartoTipoRepository.merge(quartotipoAtual, {
      quartotipoDescricao: updateQuartoTipoDto.quartotipo_descricao ?? quartotipoAtual.quartotipoDescricao,
    });

    const quartotipoSalvo = await this.quartoTipoRepository.save(quartotipoAtualizado);

    return {
      mensagem: `Tipo de quarto #${quartotipoId} atualizado com sucesso`,
      quartotipo: quartotipoSalvo,
    };
  }

  async removeQuartoTipo(quartotipoId: number): Promise<{ mensagem: string }> {
    const quartotipo = await this.quartoTipoRepository.findOne({
      where: { quartotipoId },
    });

    if (!quartotipo) {
      throw new HttpException('Erro ao excluir tipo de quarto', 404);
    }

    await this.quartoTipoRepository.softDelete(quartotipoId);
    return { mensagem: `Tipo de quarto #${quartotipoId} excluído com sucesso` };
  }
}
