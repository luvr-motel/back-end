import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../common/enums/status.enum';
import { Locacao } from '../../../modulo-locacao/locacao/entities/locacao.entity';
import { Comanda } from '../../../modulo-locacao/comanda/entities/comanda.entity';

@Entity()
export class Motel {
  @PrimaryGeneratedColumn({ name: 'motel_id', type: 'integer' })
  motelId: number;

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

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamp', nullable: true })
  motelExclusao: Date;
}
