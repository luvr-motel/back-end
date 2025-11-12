import { HttpException, Injectable } from '@nestjs/common';
import { CreateLocacaoTipoDto } from './dto/create-locacao-tipo.dto';
import { UpdateLocacaoTipoDto } from './dto/update-locacao-tipo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { LocacaoTipo } from './entities/locacao-tipo.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class LocacaoTipoService {

  constructor( @InjectRepository( LocacaoTipo) private readonly locacaoTipoRepositoy: Repository<LocacaoTipo> ){}

  async createLocacaoTipo( locacaoTipoDto: CreateLocacaoTipoDto) {
    const tipo = this.locacaoTipoRepositoy.create({
      locacaoTipo_descricao: locacaoTipoDto.locacaoTipo_descricao,
      locacoTipo_valor: locacaoTipoDto.locacoTIpo_valor
    });
      return this.locacaoTipoRepositoy.save( tipo )
  }

  async findAllLocacaoTipo(): Promise<LocacaoTipo[]>{
    return this.locacaoTipoRepositoy.find()
  }

  async findLocacaoTipoId(id: number): Promise<{ mensagem: string; tipo: LocacaoTipo}> {
    const tipoData = await this.locacaoTipoRepositoy.findOne({ where:{ locacaoTipo_id: id }});

    if ( !tipoData ){
      throw new HttpException( 'Categoria não encontrada', 404 )
    } else {
      return { 
        mensagem:  `Categoria de locação: #${id} atualizada com sucesso`, 
        tipo: tipoData }}
  }

  async updateLocacaoTipById (id: number, updateLocacaoTipoDto: UpdateLocacaoTipoDto): Promise<{ mensagem: string; tipo: LocacaoTipo }> {
    const tipoData = await this.locacaoTipoRepositoy.findOne({ where: { locacaoTipo_id: id }});
    if (!tipoData){
       throw new HttpException( 'Erro ao atualizar categoria de locação', 404 )
    } else {
      const tipo = this.locacaoTipoRepositoy.merge( tipoData, updateLocacaoTipoDto );
      const tipoSave = await this.locacaoTipoRepositoy.save( tipo );

      return{
        mensagem: 'Categoria de locação atualizada com sucesso!',
        tipo: tipoSave
      }
    }
  }

  async deleteLocacaoTipo(id: number): Promise<{ mensagem: string; tipo: LocacaoTipo}> {
    const tipoDelete = await this.locacaoTipoRepositoy.findOne({ where: {locacaoTipo_id: id}});
    if (!tipoDelete){
       throw new HttpException( 'Erro ao excluir categoria de locação', 404 )
    } else {
      await this.locacaoTipoRepositoy.softDelete(id)
      return {
        mensagem: 'Categoria de locação excluida com sucesso!',
        tipo: tipoDelete
      }
    }
  }
}
