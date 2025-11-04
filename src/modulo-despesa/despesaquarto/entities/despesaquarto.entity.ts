import { Motel } from 'src/modulo-motel/motel/entities/motel.entity';
import { Quarto } from 'src/modulo-quarto/quarto/entities/quarto.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

@Entity()
export class Despesaquarto {
  @PrimaryGeneratedColumn({ name: 'despesaquarto_id', type: 'int' })
  despesaquarto_id: number;

  @Column({ name: 'despesaquarto_descricao', type: 'varchar', length: 256 })
  despesaquarto_descricao: string;

  @Column({ name: 'despesaquarto_parcela', type: 'int', nullable: true })
  despesaquarto_parcela: number | null;

  @Column({ name: 'despesaquarto_itens', type: 'varchar', length: 256 })
  despesaquarto_itens: string;

  @Column({ name: 'despesatipo_id', type: 'int', nullable: true })
  despesatipo_id: number | null;

  @ManyToOne(() => Quarto, { nullable: false, onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'quarto_id' })
  quarto: Quarto;

  @RelationId((despesaquarto: Despesaquarto) => despesaquarto.quarto)
  quarto_id: number;

  @Column({ name: 'pessoa_id', type: 'int', nullable: true })
  pessoa_id: number | null;

  @Column({ name: 'usuario_id', type: 'int', nullable: false })
  usuario_id: number;

  @ManyToOne(() => Motel, (motel) => motel.despesaquarto, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'motel_id' })
  motel: Motel;

  @RelationId((despesaquarto: Despesaquarto) => despesaquarto.motel)
  motel_id: number;

  @CreateDateColumn({ name: 'despesaquarto_inclusao', type: 'timestamp' })
  despesaquarto_inclusao: Date;

  @DeleteDateColumn({ name: 'despesaquarto_exclusao', type: 'timestamp', nullable: true })
  despesaquarto_exclusao: Date | null;
}
