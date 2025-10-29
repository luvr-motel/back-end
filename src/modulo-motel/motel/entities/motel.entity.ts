import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import { Despesa } from 'src/modulo-despesa/despesa/entities/despesa.entity';
import { Despesaquarto } from 'src/modulo-despesa/despesaquarto/entities/despesaquarto.entity';

@Entity()
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
