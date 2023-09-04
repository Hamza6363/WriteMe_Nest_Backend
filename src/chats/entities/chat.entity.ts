import { Entity, Column, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column()
    chat: string;
    
    @UpdateDateColumn()
    updated_at: Date;
}