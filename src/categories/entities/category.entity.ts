import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, DeleteDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Article } from 'src/article/entities/article.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column() 
    title: string;
    
    @Column()
    user_id: number;
    
    @Column()
    project_id: number;
    
    @DeleteDateColumn()
    deletedAt?: Date;
    
    @ManyToMany(type => Article)
    @JoinTable({
        name: "short_article_categories",
        joinColumn: { name: "categoryId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "shortArticleId", referencedColumnName: "id" }
    }) 
    shortArticles: Article[];
    
    @ManyToOne(type => Project, project => project.categories) 
    project: Project;
    
    @ManyToMany(type => Article)
    @JoinTable({
        name: "article_categories",
        joinColumn: { name: "categoryId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "articleId", referencedColumnName: "id" }
    }) 
    articles: Article[];
    
}