import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Usuario } from 'src/modulo-pessoa/usuario/entities/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm'; 
//import { Usuario } from '../../usuario/entities/usuario.entity'; 
//import { Motel } from '../../motel/entities/motel.entity';

@Entity({ name: 'registroponto' })
export class RegistroPonto {
  @PrimaryGeneratedColumn({ name: 'registroponto_id', type: 'integer' })
  registroponto_id: number;

  @ManyToOne(() => Usuario, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'usuario_id', referencedColumnName: 'usuario_id' })
  usuario: Usuario;

  @RelationId((rp: RegistroPonto) => rp.usuario)
  usuario_id: number;

  @ManyToOne(() => Motel, { nullable: true, onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'motel_id', referencedColumnName: 'motel_id' })
  motel: Motel;

  @RelationId((rp: RegistroPonto) => rp.motel)
  motel_id: number;

  @Column({ name: 'registroponto_entrada', type: 'boolean', nullable: false })
  registroponto_entrada: boolean;

  @CreateDateColumn({ name: 'registroponto_inclusao', type: 'timestamp', default: () => 'NOW()' })
  registroponto_inclusao: Date;

  @DeleteDateColumn({ name: 'registroponto_exclusao', type: 'timestamp', nullable: true })
  registroponto_exclusao: Date | null;
}
