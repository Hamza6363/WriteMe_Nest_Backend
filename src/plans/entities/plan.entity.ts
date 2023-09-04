import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tab: string;

  @Column()
  article: string;

  @Column()
  plan_id: number;

  @Column()
  name: string;

  @Column()
  active: boolean;
}