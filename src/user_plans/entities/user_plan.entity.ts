import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity('user_plans')
export class UserPlan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    plan_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    purchase_at: Date;

    @Column()
    qty: number;

    @Column()
    credit_tabs: number;

    @Column()
    credit_articles: number;

    @Column()
    debit_articles: number;

    @Column()
    debit_tabs: number;

    @Column()
    used: number;

    @Column()
    expired: number;

    @Column()
    invoice_payment_id: number;

    @Column()
    invoice_id: number;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

}