import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ nullable: false, unsigned: true })
  idUser: number;

  @Column({ type: 'date', nullable: false })  // Especifica el tipo de columna como 'date'
  //el profe tenía default: () => 'CURRENT_TIMESTAMP'
  date: Date;

  @Column({ type: 'time', nullable: false }) //propiedad entered es de tipo string en TypeScript, pero se almacenará en la base de datos como un tipo time
  entered: string;

  @Column({ type: 'time', nullable: true, default: null })
  left: string;
}