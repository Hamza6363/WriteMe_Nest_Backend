import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, ManyToMany, JoinTable, DeleteDateColumn, CreateDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    article: string;

    @Column()
    user_id: number;

    @Column()
    project_id: number;

    @Column()
    title: string;

    @Column()
    words_length: number

    @Column()
    language: string;
    
    @Column()
    intent: string;

    @Column()
    article_heading: string;
    
    @Column()
    coherence: number;

    @Column()
    creativity: number;

    @Column()
    copies: number;

    @Column()
    isProcessing: boolean;

    @Column()
    pending: boolean;
    
    @Column()
    size: number;

    @Column()
    referenceText: string;
    
    @ManyToOne(type => Project, project => project.articles)
    project: Project;

    @DeleteDateColumn()
    deletedAt?: Date;

    @CreateDateColumn()
    createdAt?: Date;
    

    @ManyToMany(type => Keyword)
    @JoinTable({
        name: "article_keywords",
        joinColumn: { name: "articleId", referencedColumnName: "id" },
        inverseJoinColumn: { name: "keywordId", referencedColumnName: "id" }
    })
    keywords: Keyword[];

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'article_category', // Name of the joining table
        joinColumn: { name: 'articalId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' }
    })
    category: Category[]
    
}