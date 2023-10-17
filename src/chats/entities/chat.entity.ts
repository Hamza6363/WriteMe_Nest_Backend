import { Entity, Column, UpdateDateColumn, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('chats')
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({type: 'longtext'})
    title: string;

    @Column({type: 'longtext', nullable: true})
    chat: string;
    
    @CreateDateColumn({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ nullable: true, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
    
    // @UpdateDateColumn({ nullable: true, type: 'timestamp'})
    // deleted_at: Date;
    @DeleteDateColumn()
    deleted_at?: Date;
}