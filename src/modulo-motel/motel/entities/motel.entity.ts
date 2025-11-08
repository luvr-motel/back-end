import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from '../../../modulo-locacao/comanda/entities/comanda.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { Despesa } from 'src/modulo-despesa/despesa/entities/despesa.entity';
import { Despesaquarto } from 'src/modulo-despesa/despesaquarto/entities/despesaquarto.entity';
import { Recebimento } from '../../../modulo-pagamento/recebimento/entities/recebimento.entity';

@Entity({ name: 'motel' })
export class Motel {
  @PrimaryGeneratedColumn({ name: 'motel_id', type: 'integer' })
  motel_id: number;

  @Column({ name: 'motel_descricao', type: 'varchar', length: 255, nullable: true })
  motelDescricao: string;

  @Column({ name: 'motel_endereco', type: 'varchar', length: 255, nullable: true })
  motelEndereco: string;

  @Column({ name: 'motel_email', type: 'varchar', length: 255, nullable: true })
  motelEmail: string;

  @Column({ name: 'motel_cnpj', type: 'varchar', length: 18, nullable: false, unique: true })
  motelCnpj: string;

  @Column({ name: 'motel_ativo', type: 'enum', enum: Status, default: Status.ATIVO })
  motelAtivo: Status;

  // Relacionamentos reversos
  @OneToMany(() => Locacao, (locacao) => locacao.motel)
  locacoes: Locacao[];

  @OneToMany(() => Comanda, (comanda) => comanda.motel)
  comandas: Comanda[];

  @CreateDateColumn({ name: 'motel_inclusao', type: 'timestamp' })
  motelInclusao: Date;

  @OneToMany(() => Recebimento, (recebimento) => recebimento.motel_id)
  recebimento: Recebimento[];

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamp', nullable: true })
  motelExclusao: Date;

  @OneToMany(() => Quarto, (quarto) => quarto.motel)
  quartos: Quarto[];

  @OneToMany(() => Despesaquarto, (despesaquarto) => despesaquarto.motel)
  despesaquarto: Despesaquarto[];

  @OneToMany(() => Despesa, (despesa) => despesa.motel)
  despesa: Despesa[];
}
