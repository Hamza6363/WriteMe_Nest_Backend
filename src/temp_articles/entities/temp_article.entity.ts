import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { Project } from 'src/projects/entities/project.entity';

@Entity('temp_articles')
export class TempArticle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column()
    projectId: number;

    @Column()
    keywords: string;

    @Column()
    title: string;
    
    @Column()
    blogIdea: string;

    @Column()
    blogOutline: string;
    
    @Column()
    blogIntro: string;

    @Column()
    blogSections: string;
    
    @Column()
    blogConclusion: string;

    @Column()
    isProcessing: boolean;

    @UpdateDateColumn()
    updated_at: Date;
    
    @ManyToOne(type => Project, project => project.tempArticles)
    project: Project;
}
