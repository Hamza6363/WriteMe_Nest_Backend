import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
    JoinColumn
} from 'typeorm'

@Entity()
export class Project {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    title: string
    
    @Column('text')
    details: string
    
    @Column()
    url: string
    
    @Column()
    pic: string
    
    @CreateDateColumn({type: 'timestamp'})
    created_at: Date

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date

    @DeleteDateColumn()
    deleted_at: Date
}