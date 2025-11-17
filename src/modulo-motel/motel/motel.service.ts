import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import { Motel, MotelStatus } from './entities/motel.entity';
import { CreateMotelDto } from './dto/create-motel.dto';
import { UpdateMotelDto } from './dto/update-motel.dto';

@Injectable()
export class MotelService {
  constructor(@InjectRepository(Motel) private readonly repo: Repository<Motel>) {}

  async createMotel(dto: CreateMotelDto): Promise<Motel> {
    const exists = await this.repo.findOne({
      where: { motel_cnpj: dto.motel_cnpj, motel_exclusao: IsNull() },
    });
    if (exists) throw new BadRequestException('CNPJ já cadastrado');

    const entity = this.repo.create({
      motel_descricao: dto.motel_descricao ?? null,
      motel_endereco : dto.motel_endereco ?? null,
      motel_email    : dto.motel_email ?? null,
      motel_cnpj     : dto.motel_cnpj,
      motel_ativo    : dto.motel_ativo ?? MotelStatus.ATIVO,
    });

    if (!entity) {
      throw new HttpException('Erro ao cadastrar Motel', 400);
    } else {
      return this.repo.save(entity)
    }
  }

  async findAllMoteis(): Promise<Motel[]> {
    return this.repo.find({
      where: { motel_exclusao: IsNull() },
      order: { motel_id: 'ASC' },
    });
  }

  async findOneMotel(id: number): Promise<Motel> {
    const found = await this.repo.findOne({
      where: { motel_id: id, motel_exclusao: IsNull() },
    });
    if (!found) throw new NotFoundException('Motel não encontrado');
    return found;
  }

  async updateMotel(id: number, dto: UpdateMotelDto): Promise<Motel> {
    const entity = await this.findOneMotel(id);

    if (dto.motel_cnpj && dto.motel_cnpj !== entity.motel_cnpj) {
      const exists = await this.repo.findOne({
        where: { motel_cnpj: dto.motel_cnpj, motel_exclusao: IsNull(), motel_id: Not(id) },
      });
      if (exists) throw new BadRequestException('CNPJ já cadastrado');
      entity.motel_cnpj = dto.motel_cnpj;
    }

    if (dto.motel_descricao !== undefined) entity.motel_descricao = dto.motel_descricao ?? null;
    if (dto.motel_endereco  !== undefined) entity.motel_endereco  = dto.motel_endereco ?? null;
    if (dto.motel_email     !== undefined) entity.motel_email     = dto.motel_email ?? null;
    if (dto.motel_ativo     !== undefined) entity.motel_ativo     = dto.motel_ativo;

    return this.repo.save(entity);
  }

  async deleteMotel(id: number): Promise<{ mensagem: string }> {
    const motel = await this.repo.findOne({ where: { motel_id: id, motel_exclusao: IsNull() } });
    if (!motel) throw new HttpException('Erro ao excluir motel', 404);

    await this.repo.softDelete(id);

    return { mensagem: `Motel ${id} excluído com sucesso` };
  }

  async relatorioMotel( dataInicio: string, dataFim: string, motelId: number ) : Promise<any[]> {
    const query = `
                    WITH filtroReceitas AS (
                      SELECT 
                        loc.motel_id,
                        SUM(loc.locacao_totalLocacao) AS valor
                      FROM locacao loc
                      WHERE loc.motel_id = $1
                        AND loc.locacao_inclusao BETWEEN $2 AND $3
                      GROUP BY loc.motel_id
                    ),
                    filtroDespesas AS (
                      SELECT *
                      FROM despesa desp
                      WHERE desp.motel_id = $1
                        AND desp.despesa_inclusao BETWEEN $2 AND $3
                    )
                    SELECT *
                    FROM filtroReceitas ftr
                    LEFT JOIN filtroDespesas ftd ON ftd.motel_id = ftr.motel_id    
    `;
    const rows = await this.repo.query( query, [ motelId, dataInicio, dataFim ]);
    return rows;
  }

}
