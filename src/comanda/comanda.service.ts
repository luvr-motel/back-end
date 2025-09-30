import { HttpException, Injectable } from '@nestjs/common';
import { CreateComandaDto } from './dto/create-comanda.dto';
import { UpdateComandaDto } from './dto/update-comanda.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comanda } from './entities/comanda.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComandaService {

  constructor( 
    @InjectRepository( Comanda ) private readonly comandaRepository: Repository<Comanda>
  ){}

  async createComanda( comandaDto : CreateComandaDto) {
    const comanda = this.comandaRepository.create({
      comanda_observacao: comandaDto.comanda_observacao,
      comanda_qtde: comandaDto.comanda_qtde
    });
    return this.comandaRepository.save( comanda )
  }

  findAllComandas() {
    return this.comandaRepository.find();
  }

  async findComandaId(id: number): Promise<{ mensagem: string; comanda: Comanda }> {
    const comandaData = await this.comandaRepository.findOne({where: {quarto_id: id}});
    
    if ( !comandaData ){
      throw new HttpException( 'Comanda não encontrada', 404 )
    } else { 
      return {
        mensagem: `Comanda ${id} `,
        comanda: comandaData
      }
    }
  }

  async updateComanda( id: number, updateComandaDto: UpdateComandaDto ): Promise< { mensagem: string;  comanda: Comanda }>   {
    const comandaAtualizada = await this.comandaRepository.findOne({where: {comanda_id: id}});
    
    if ( !comandaAtualizada ) {
      throw new HttpException( 'Erro ao atualizar comanda', 404 )
    } else {
      const comanda = this.comandaRepository.merge( comandaAtualizada, updateComandaDto );
      const comandaSave = await this.comandaRepository.save( comanda );

      return { 
      mensagem: `Comanda #${id} atualizada com sucesso`, 
      comanda: comandaSave
      }
    };
  }

  async removeComanda(id: number): Promise<void> {
    await this.comandaRepository.delete(id);
  }

  async removeItemComanda(id: number): Promise<void> {
     await this.comandaRepository.delete(id);
  }

}
