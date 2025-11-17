import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Usuario } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'registroponto' })
export class RegistroPonto {
  @PrimaryGeneratedColumn({ name: 'registroponto_id', type: 'integer' })
  registroponto_id: number;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id', referencedColumnName: 'usuario_id' })
  usuario: Usuario;

  @ManyToOne(() => Motel, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'motel_id', referencedColumnName: 'motel_id' })
  motel: Motel | null;

  @Column({ name: 'registroponto_entrada', type: 'boolean', nullable: false })
  registroponto_entrada: boolean;

  @CreateDateColumn({ name: 'registroponto_inclusao', type: 'timestamp', default: () => 'NOW()' })
  registroponto_inclusao: Date;

  @DeleteDateColumn({ name: 'registroponto_exclusao', type: 'timestamp', nullable: true })
  registroponto_exclusao: Date | null;
}
