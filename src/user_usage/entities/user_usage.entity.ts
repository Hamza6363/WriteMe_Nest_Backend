import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('user_usage')
export class UserUsage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tab: number;

    @Column()
    article: number;

    @Column()
    plan_id: number;

    @Column()
    user_plan_id: number;

    @Column()
    plan_name: string;

    @ManyToOne(type => User)
    user: User;

}