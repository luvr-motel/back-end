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


  createComanda(createComandaDto: CreateComandaDto) {
    return 'This action adds a new comanda';
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

  updateComanda(id: number, updateComandaDto: UpdateComandaDto) {
    return `This action updates a #${id} comanda`;
  }

  removeComanda(id: number) {
    return `This action removes a #${id} comanda`;
  }

  removeItemComanda(id: number) {
    return `This action removes a #${id} comanda`;
  }

}
