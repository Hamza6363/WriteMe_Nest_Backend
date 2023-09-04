import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, DeleteDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Article } from 'src/article/entities/article.entity';

@Entity()
export class Keyword {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    keyword: string;

    @Column()
    user_id: number;

    @Column()
    project_id: number;

    
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(type => Project, project => project.keywords)
    project: Project;


    @ManyToMany(type => Article)
    @JoinTable({
        name: "article_keywords",
        joinColumn: { name: "keywordId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "articleId", referencedColumnName: "id" }
    })
    articles: Article[];
}