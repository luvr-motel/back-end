import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum MotelStatus { ATIVO = 'ATIVO', INATIVO = 'INATIVO' }

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

  @CreateDateColumn({ name: 'motel_inclusao', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  motel_inclusao: Date;

  @DeleteDateColumn({ name: 'motel_exclusao', type: 'timestamp', nullable: true })
  motel_exclusao: Date;
}
