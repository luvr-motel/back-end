import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Status } from '../common/enums/status.enum';

@Entity('motel')
export class Motel {
  @PrimaryGeneratedColumn({ name: 'motel_id', type: 'integer' })
  motelId: number;

  @Column({ name: 'motel_descricao', type: 'varchar', length: 255, nullable: true })
  motelDescricao?: string | null;

  @Column({ name: 'motel_endereco', type: 'varchar', length: 255, nullable: true })
  motelEndereco?: string | null;

  @Column({ name: 'motel_email', type: 'varchar', length: 255, nullable: true })
  motelEmail?: string | null;

  @Column({ name: 'motel_cnpj', type: 'varchar', length: 18, nullable: false, unique: true })
  motelCnpj: string;

  @Column({ name: 'motel_ativo', type: 'enum', enum: Status, default: Status.ATIVO })
  motelAtivo: Status;

  @CreateDateColumn({ name: 'motel_inclusao', type: 'timestamptz' })
  motelInclusao: Date;

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamptz', nullable: true })
  motelExclusao?: Date | null;
}
