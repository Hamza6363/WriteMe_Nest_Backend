import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    details: string;
    
    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}