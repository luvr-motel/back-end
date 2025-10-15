import { HttpException, Injectable } from '@nestjs/common';
import { CreatePagamentoFormaDto } from './dto/create-pagamento-forma.dto';
import { UpdatePagamentoFormaDto } from './dto/update-pagamento-forma.dto';
import { PagamentoForma } from './entities/pagamento-forma.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PagamentoFormaService {

  constructor ( @InjectRepository( PagamentoForma ) private readonly formaRepository: Repository< PagamentoForma >){}
  async createPagamentoForma( pagamentoFormaDto: CreatePagamentoFormaDto) {
    const posicaoNew = this.formaRepository.create({
      pagamentoForma_descricao    : pagamentoFormaDto.pagamentoForma_descricao,
      pagamentoForma_contaDestino : pagamentoFormaDto.pagamentoForma_contaDestino   
    });
    if ( !posicaoNew ) {
      throw new HttpException('Não foi possivel criar nova forma de pagamento!', 404);
    } else {
      return this.formaRepository.save( posicaoNew );
    }
  }

  async findAllPagamentoForma(): Promise<PagamentoForma[]> {
    return this.formaRepository.find();
  }

  async findPagamentoFormaById(id: number): Promise<{ mensagem: string; forma: PagamentoForma }> {
    const formaData = await this.formaRepository.findOne({ where: { pagamentoForma_id: id }});

    if (!formaData) {
      throw new HttpException( 'Forma de pagamento não encontrada', 404 );
    } else {
      return {
        mensagem: `Forma de pagamento; ${id}`,
        forma: formaData
      } 
    }
  }

  async updatePagamentoFormaById(id: number, updatePagamentoFormaDto: UpdatePagamentoFormaDto): Promise<{ mensagem: string; forma: PagamentoForma }> {
    const formaData = await this.formaRepository.findOne({ where: { pagamentoForma_id: id }});

    if (!formaData) {
      throw new HttpException( 'Erro ao atualizar forma de pagamento', 404 );
    } else {
      const formas = this.formaRepository.merge( formaData, updatePagamentoFormaDto );
      const formaSave = await this.formaRepository.save( formas );

      return {
        mensagem: `Forma de pagamento; ${id}`,
        forma: formaSave
      } 
    }
  }

  async deletePagamentoForma(id: number): Promise<{ mensagem: string; forma: PagamentoForma }> {
    const forma = await this.formaRepository.findOne({ where: { pagamentoForma_id: id }});

    if (!forma) {
      throw new HttpException( 'Erro ao excluir Forma de pagamento', 404 )
    } else {
      await this.formaRepository.softDelete(id);
      return {
        mensagem: `Forma de pagamento ${id} Excluido com sucesso`,
        forma: forma
     }
    }
  }
}
