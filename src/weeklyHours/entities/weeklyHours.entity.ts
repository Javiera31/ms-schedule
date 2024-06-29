import { isString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WeeklyHours {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column({ unsigned: true, nullable: false })
  userId: number;

  @Column({ type: 'date', nullable: false })
  weekStart: Date;

  @Column({ type: 'json', nullable: true })
  monday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  tuesday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  wednesday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  thursday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  friday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  saturday: Record<string, number>;

  @Column({ type: 'json', nullable: true })
  sunday: Record<string, number>;
}