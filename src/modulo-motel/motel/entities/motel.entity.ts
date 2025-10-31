import { MaxLength } from 'class-validator';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from '../../../modulo-locacao/comanda/entities/comanda.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { Despesa } from 'src/modulo-despesa/despesa/entities/despesa.entity';
import { Despesaquarto } from 'src/modulo-despesa/despesaquarto/entities/despesaquarto.entity';

@Entity()
export class Motel {
  @PrimaryGeneratedColumn({ name: 'motel_id', type: 'integer' })
  motel_id: number;

  @Column({ name: 'motel_descricao', type: 'varchar', nullable: true })
  motelDescricao: string;

  @Column({ name: 'motel_endereco', type: 'varchar', nullable: true })
  motelEndereco: string;

  @Column({ name: 'motel_email', type: 'varchar',  nullable: true })
  motelEmail: string;

  @Column({ name: 'motel_cnpj', type: 'varchar', nullable: false, unique: true })
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

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamp', nullable: true })
  motelExclusao: Date;

  @OneToMany(() => Quarto, (quarto) => quarto.motel)
  quartos: Quarto[];

  @OneToMany(() => Despesaquarto, (despesaquarto) => despesaquarto.motel)
  despesaquarto: Despesaquarto[];

  @OneToMany(() => Despesa, (despesa) => despesa.motel)
  despesa: Despesa[];
}
