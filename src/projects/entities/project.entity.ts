import { Entity, Column, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from 'typeorm';
import { Keyword } from 'src/keywords/entities/keyword.entity';
import { Category } from 'src/categories/entities/category.entity';
import { Article } from 'src/article/entities/article.entity';
import { ShortArticle } from 'src/short_articles/entities/short_article.entity'
import { TempArticle } from 'src/temp_articles/entities/temp_article.entity'

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    details: string;

    @Column()
    url: string;

    @Column()
    user_id: number;

    @Column()
    pic: string;
    
    @DeleteDateColumn()
    deletedAt?: Date;

    @OneToMany(type => Keyword, keyword => keyword.project)
    keywords: Keyword[];

    @OneToMany(type => Article, article => article.project)
    articles: Article[];

    @OneToMany(type => ShortArticle, shortArticle => shortArticle.project)
    shortArticles: ShortArticle[];

    @OneToMany(type => TempArticle, tempArticle => tempArticle.project)
    tempArticles: TempArticle[];
    
    @OneToMany(type => Category, category => category.project)
    categories: Category[];
}