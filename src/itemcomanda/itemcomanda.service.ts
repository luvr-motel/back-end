import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { CreateItemcomandaDto } from './dto/create-itemcomanda.dto';
import { UpdateItemcomandaDto } from './dto/update-itemcomanda.dto';

import { ItemComanda } from './entities/itemcomanda.entity';
import { Locacao } from 'src/modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from 'src/modulo-locacao/comanda/entities/comanda.entity';
import { Produto } from 'src/modulo-produto/produto/entities/produto.entity';
import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';

@Injectable()
export class ItemcomandaService {
  constructor(
    @InjectRepository(ItemComanda)
    private readonly itemRepository: Repository<ItemComanda>,

    @InjectRepository(Locacao)
    private readonly locacaoRepository: Repository<Locacao>,

    @InjectRepository(Comanda)
    private readonly comandaRepository: Repository<Comanda>,

    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,

    @InjectRepository(Motel)
    private readonly motelRepository: Repository<Motel>,
  ) {}

  async create(dto: CreateItemcomandaDto) {
    const { locacao_id, produto_id, qtde, valor, comanda_id } = dto;

    // ============================
    // 1. BUSCAR LOCAÇÃO CORRETA
    // ============================
    const locacao = await this.locacaoRepository.findOne({
      where: { locacao_id },
      relations: ['motel'],
    });

    if (!locacao) throw new NotFoundException('Locação não encontrada');

    // ============================
    // 2. BUSCAR PRODUTO
    // ============================
    const produto = await this.produtoRepository.findOne({
      where: { produto_id },
    });

    if (!produto) throw new NotFoundException('Produto não encontrado');

    // ============================
    // 3. BUSCAR OU CRIAR COMANDA
    // ============================
    let comanda: Comanda;

    if (comanda_id) {
      const existing = await this.comandaRepository.findOne({
        where: { comanda_id },
      });

      if (!existing) throw new NotFoundException('Comanda não encontrada');
      comanda = existing;
    } else {
      comanda = await this.comandaRepository.save(
        this.comandaRepository.create({
          locacao: locacao,
          motel: locacao.motel,
          produto: produto,
          comanda_qtde: qtde,
        }),
      );
    }

    // ============================
    // 4. CRIAR ITEM DA COMANDA
    // ============================
    const item = this.itemRepository.create({
      comanda,
      locacao,
      produto,
      motel: locacao.motel,

      itemLocacao_qtde: qtde,
      itemLocacao_valor: valor ?? produto.produto_venda,
    });

    const saved = await this.itemRepository.save(item);

    // ============================
    // 5. RETORNAR COMANDA ATUALIZADA
    // ============================
    const comandaFinal = await this.comandaRepository.findOne({
      where: { comanda_id: comanda.comanda_id },
      relations: ['itens', 'itens.produto', 'locacao', 'motel'],
    });

    return {
      mensagem: 'Item adicionado com sucesso',
      comanda: comandaFinal,
      item: saved,
    };
  }

  // ============================
  // LISTAR ITENS POR COMANDA
  // ============================
  async findAllByComanda(comanda_id: number) {
    return await this.itemRepository.find({
      where: {
        comanda: { comanda_id },
        itemLocacao_exclusao: IsNull(),
      },
      relations: ['produto', 'locacao', 'motel'],
      order: { itemLocacao_inclusao: 'DESC' },
    });
  }

  // ============================
  // BUSCAR ITEM ESPECÍFICO
  // ============================
  async findOne(id: number) {
    const item = await this.itemRepository.findOne({
      where: { itemLocacao_id: id },
      relations: ['produto', 'comanda', 'locacao', 'motel'],
    });

    if (!item) throw new NotFoundException('Item não encontrado');

    return item;
  }

  // ============================
  // ATUALIZAR QTDE
  // ============================
  async update(id: number, dto: UpdateItemcomandaDto) {
    const item = await this.findOne(id);

    item.itemLocacao_qtde = dto.qtde ?? item.itemLocacao_qtde;

    const saved = await this.itemRepository.save(item);

    return { mensagem: 'Quantidade atualizada com sucesso', item: saved };
  }

  // ============================
  // SOFT DELETE
  // ============================
  async remove(id: number) {
    const item = await this.findOne(id);

    item.itemLocacao_exclusao = new Date();

    await this.itemRepository.save(item);

    return { mensagem: 'Item removido com sucesso (soft delete)' };
  }
}
