import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Quarto } from '../../../quarto/entities/quarto.entity';

@Entity()
// @Index('uq_quartotipo_descricao', ['quartotipoDescricao'], { unique: true })
export class QuartoTipo {
  @PrimaryGeneratedColumn({ name: 'quartotipo_id', type: 'int' })
  quartotipo_Id: number;

  @Column({ name: 'quartotipo_descricao', type: 'varchar', length: 255 })
  quartotipoDescricao: string;

  @OneToMany(() => Quarto, (quarto) => quarto.quartotipo)
  quartos: Quarto[];

  @CreateDateColumn({ name: 'quartotipo_inclusao', type: 'timestamp'})
  quartotipo_Inclusao: Date | null;
  
  @DeleteDateColumn({ name: 'quartotipo_exclusao', type: 'timestamp', nullable: true })
  quartotipo_Exclusao: Date;
}