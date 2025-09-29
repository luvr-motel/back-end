import {Column,Entity,PrimaryGeneratedColumn,} from 'typeorm';

@Entity({ name: 'despesageral' })
export class Despesageral {
  @PrimaryGeneratedColumn({ name: 'despesageral_id' })
  id: number;

  @Column({ type: 'varchar' })
  descricao: string;

  @Column({ type: 'int', nullable: true })
  parcela?: number | null;

  @Column({ type: 'varchar', nullable: true })
  prestador?: string | null;

  @Column({ type: 'varchar' })
  itens: string;

  @Column({ type: 'int', nullable: true })
  despesatipoId?: number | null;
}
