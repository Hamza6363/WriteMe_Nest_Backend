import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Article } from 'src/article/entities/article.entity';
import { UserUsage } from 'src/user_usage/entities/user_usage.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    login: string;

    @Column()
    amemberId: number;

    @Column()
    type: string;

    @Column()
    verify_code: string;

    @Column()
    pic: string;
    
    @Column()
    user_name: string;

    @Column()
    lastArticleId: number;

    @Column()
    token_for_business: string;
    
    @Column()
    login_type: string;

    @Column({type: 'timestamp', nullable: true})
    deletedAt: Date;

    @ManyToMany(type => Article)
    @JoinTable({
        name: 'user_downloads',
        joinColumn: { name: 'userId', referencedColumnName: 'id'},
        inverseJoinColumn: { name: 'articleId', referencedColumnName: 'id'}
    })
    downloadedArticles: Article[];

    @OneToMany(type => UserUsage, userUsage => userUsage.user)
    usages: UserUsage[];
}