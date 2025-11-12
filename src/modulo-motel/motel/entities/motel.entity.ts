export enum MotelStatus { ATIVO = 'ATIVO', INATIVO = 'INATIVO' }
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from '../../../modulo-locacao/comanda/entities/comanda.entity';
import { Quarto } from '../../../modulo-quarto/quarto/entities/quarto.entity';
import { Despesa } from '../../../modulo-despesa/despesa/entities/despesa.entity';
import { Despesaquarto } from '../../../modulo-despesa/despesaquarto/entities/despesaquarto.entity';
import { Recebimento } from '../../../modulo-pagamento/recebimento/entities/recebimento.entity';

@Entity({ name: 'motel' })
export class Motel {
  @PrimaryGeneratedColumn({ name: 'motel_id', type: 'integer' })
  motel_id: number;

  @Column({ name: 'motel_descricao', type: 'varchar', length: 255, nullable: true })
  motel_descricao: string;

  @Column({ name: 'motel_endereco', type: 'varchar', length: 255, nullable: true })
  motel_endereco: string;

  @Column({ name: 'motel_email', type: 'varchar', length: 255, nullable: true })
  motel_email: string;

  @Column({ name: 'motel_cnpj', type: 'varchar', length: 18, nullable: false, unique: true })
  motel_cnpj: string;

  @Column({ name: 'motel_ativo', type: 'enum', enum: MotelStatus, enumName: 'status', default: MotelStatus.ATIVO })
  motel_ativo: MotelStatus;

  // Relacionamentos reversos
  @OneToMany(() => Locacao, (locacao) => locacao.motel)
  locacoes: Locacao[];

  @OneToMany(() => Comanda, (comanda) => comanda.motel)
  comandas: Comanda[];

  @CreateDateColumn({ name: 'motel_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  motel_inclusao: Date;

  @OneToMany(() => Recebimento, (recebimento) => recebimento.motel_id)
  recebimento: Recebimento[];

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamp', nullable: true })
  motel_exclusao: Date;

  @OneToMany(() => Quarto, (quarto) => quarto.motel)
  quartos: Quarto[];

  @OneToMany(() => Despesaquarto, (despesaquarto) => despesaquarto.motel)
  despesaquartos: Despesaquarto[];

  @OneToMany(() => Despesa, (despesa) => despesa.motel)
  despesas: Despesa[];
}
