import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class ShortArticle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    article: string;
    
    @Column('text')
    current_article: string;

    @Column()
    user_id: number;

    @Column()
    project_id: number;

    @Column()
    title: string;
    
    @CreateDateColumn()
    created_at?: Date;

    @ManyToOne(type => Project, project => project.shortArticles)
    project: Project;
    
    @ManyToMany(type => Category)
    @JoinTable({
        name: "article_category", // Name of the table that will be created in the database
        joinColumn: { name: "articleId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "categoryId", referencedColumnName: "id" }
    }) 
    categories: Category[];
}
