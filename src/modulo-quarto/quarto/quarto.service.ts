import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateQuartoDto } from './dto/create-quarto.dto';
import { UpdateQuartoDto } from './dto/update-quarto.dto';
import { Quarto } from './entities/quarto.entity';
import { QuartoTipo } from '../quarto_tipo/entities/quarto_tipo.entity';

@Injectable()
export class QuartoService {
  constructor(
    @InjectRepository(Quarto)
    private quartoRepository: Repository<Quarto>,
  ) {}

  async createQuarto(createQuartoDto: CreateQuartoDto): Promise<Quarto> {
    const { quartotipo_id, ...rest } = createQuartoDto;
    const quarto = this.quartoRepository.create({
      ...rest,
      quartotipo: { quartotipo_Id: quartotipo_id } as QuartoTipo,
    });

    return this.quartoRepository.save(quarto);
  }

  async findAllQuartos(): Promise<Quarto[]> {
    return this.quartoRepository.find();
  }

  async findQuartoId(id: number): Promise<{ mensagem: string; quarto: Quarto }> {
    const quarto = await this.quartoRepository.findOne({ where: { quarto_id: id } });

    if (!quarto) {
      throw new HttpException('Quarto não encontrado', 404);
    }

    return {
      mensagem: `Quarto #${id}`,
      quarto,
    };
  }

  // async updateQuarto(
  //   id: number,
  //   updateQuartoDto: UpdateQuartoDto,
  // ): Promise<{ mensagem: string; quarto: Quarto }> {
  //   const quartoAtual = await this.quartoRepository.findOne({ where: { quarto_id: id } });

  //   if (!quartoAtual) {
  //     throw new HttpException('Erro ao atualizar quarto', 404);
  //   }

  //   // const { quartotipo_id, ...rest } = updateQuartoDto;
  //   // const quartoAtualizado = this.quartoRepository.merge(quartoAtual, rest);

  //   // if (typeof quartotipo_id !== 'undefined') {
  //   //   quartoAtualizado.quartotipo = { quartotipoId: quartotipo_id } as QuartoTipo;
  //   // }

  //   // const quartoSalvo = await this.quartoRepository.save(quartoAtualizado);

  //   // return {
  //   //   mensagem: `Quarto #${id} atualizado com sucesso`,
  //   //   quarto: quartoSalvo,
  //   // };
  // }

  async deleteQuartoById(id: number): Promise<{ mensagem: string }> {
    const quarto = await this.quartoRepository.findOne({ where: { quarto_id: id } });

    if (!quarto) {
      throw new HttpException('Erro ao excluir quarto', 404);
    }

    await this.quartoRepository.softDelete(id);
    return { mensagem: `Quarto #${id} excluído com sucesso` };
  }
}
