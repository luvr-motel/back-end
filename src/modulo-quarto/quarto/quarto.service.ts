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
    const { quartotipo_id, motel, ...rest } = createQuartoDto;
    const quarto = this.quartoRepository.create({
      ...rest,
      quartotipo: { quartotipo_Id: quartotipo_id } as QuartoTipo,
      motel: motel ? ({ motel_id: motel } as any) : undefined,
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

  async updateQuarto(id: number, updateQuartoDto: UpdateQuartoDto): Promise<{ mensagem: string; quarto: Quarto }> {
    const quartoAtualizado = await this.quartoRepository.findOne({where: {quarto_id : id}})
    if( !quartoAtualizado){
      throw new HttpException( 'Erro ao atualizar quarto', 404)
    }

    const quarto = this.quartoRepository.merge(quartoAtualizado, updateQuartoDto as any);
    const quartoSave = await this.quartoRepository.save(quarto);

    return {
      mensagem: `quarto #${id} atualizado com sucesso`,
      quarto: quartoSave
    }
  }

  async deleteQuartoById(id: number): Promise<{ mensagem: string }> {
    const quarto = await this.quartoRepository.findOne({ where: { quarto_id: id } });

    if (!quarto) {
      throw new HttpException('Erro ao excluir quarto', 404);
    }

    await this.quartoRepository.softDelete(id);
    return { mensagem: `Quarto #${id} excluído com sucesso` };
  }
}