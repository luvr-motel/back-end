import { Injectable } from '@nestjs/common';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocacaoTipo } from './entities/locacao-tipo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LocacaoTipoService {

  constructor( @InjectRepository( LocacaoTipo) private readonly locacaoTipoRepositoy: Repository<LocacaoTipo> ){}

  async createLocacaoTipo( locacaoTipoDto: CreateLocacaoTipoDto) {
    const tipo = this.locacaoTipoRepositoy.create({
      locacaoTipo_descricao: locacaoTipoDto.locacaoTipo_descricao
    });
      return this.locacaoTipoRepositoy.save( tipo )
  }

  async findAllLocacaoTipo(): Promise<LocacaoTipo[]>{
    return this.locacaoTipoRepositoy.find()
  }

  async findLocacaoTipoId(id: number): Promise<{ mensagem: string; tipo: LocacaoTipo}> {
    const tipoData = await this.locacaoTipoRepositoy.findOne({ where:{ locacaoTipo_id: id }});

    if ( !tipoData ){
    
    } else {
      return { 
        mensagem:  `Categoria de locação: #${id} atualizada com sucesso`, 
        tipo: tipoData }}
  }

  update(id: number, updateLocacaoTipoDto: UpdateLocacaoTipoDto) {
    return `This action updates a #${id} locacaoTipo`;
  }

  remove(id: number) {
    return `This action removes a #${id} locacaoTipo`;
  }
}
