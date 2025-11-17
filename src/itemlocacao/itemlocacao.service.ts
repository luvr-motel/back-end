import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { CreateItemlocacaoDto } from './dto/create-itemlocacao.dto';
import { UpdateItemlocacaoDto } from './dto/update-itemlocacao.dto';

import { ItemLocacao } from './entities/itemlocacao.entity';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

@Injectable()
export class ItemlocacaoService {
  constructor(
    @InjectRepository(ItemLocacao)
    private readonly itemRepository: Repository<ItemLocacao>,

    @InjectRepository(Locacao)
    private readonly locacaoRepository: Repository<Locacao>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Motel)
    private readonly motelRepository: Repository<Motel>,
  ) {}

  async create(dto: CreateItemlocacaoDto) {
    const { locacao_id, produto_id, qtde, valor } = dto;

    const locacao = await this.locacaoRepository.findOne({
      where: { locacao_id },
      relations: ['motel'],
    });

    if (!locacao) throw new NotFoundException('Locação não encontrada');

    const produto = await this.produtoRepository.findOne({
      where: { produto_id },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');

    const item = this.itemRepository.create({
      locacao,
      produto,
      motel: locacao.motel,
      itemLocacao_qtde: qtde,
      itemLocacao_valor: valor ?? produto.produto_venda,
    });

    const saved = await this.itemRepository.save(item);

    return { mensagem: 'Item adicionado com sucesso', item: saved };
  }

  async findAllByLocacao(locacao_id: number) {
    return await this.itemRepository.find({
      where: {
        locacao: { locacao_id },
        itemLocacao_exclusao: IsNull(),
      },
      relations: ['produto', 'locacao', 'motel'],
      order: { itemLocacao_inclusao: 'DESC' },
    });
  }

  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { itemLocacao_id: id },
      relations: ['produto', 'locacao', 'motel'],
    });

    if (!item) throw new NotFoundException('Item não encontrado');

    return item;
  }

  async update(id: number, dto: UpdateItemlocacaoDto) {
    const item = await this.findOne(id);

    item.itemLocacao_qtde = dto.qtde ?? item.itemLocacao_qtde;

    const saved = await this.itemRepository.save(item);

    return { mensagem: 'Quantidade atualizada com sucesso', item: saved };
  }

  async remove(id: number) {
    const item = await this.findOne(id);

    item.itemLocacao_exclusao = new Date();

    await this.itemRepository.save(item);

    return { mensagem: 'Item removido com sucesso (soft delete)' };
  }
}

