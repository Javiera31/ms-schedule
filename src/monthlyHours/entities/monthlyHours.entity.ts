import { isNumber } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MonthlyHours {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true, nullable: false })
  userId: number;

  @Column({ unsigned: true, nullable: false })
  year: number;

  @Column({ unsigned: true, nullable: false })
  month: number;

  @Column('decimal', { precision: 5, scale: 2 })
  monthlyTotal: number;
}