import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
    JoinColumn
} from 'typeorm'

enum UserRole {
    Admin = 'admin',
    User = 'user',
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    login: string

    @Column()
    first_name: string
    
    @Column()
    last_name: string
    
    @Column()
    user_name: string
    
    @Column()
    email: string
    
    @CreateDateColumn({type: 'timestamp'})
    email_verified_at: Date
    
    @Column()
    password: string
    
    @Column()
    remember_token: string
    
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.User, // You can set a default value if needed
    })
    type: string
    
    @Column()
    last_artical_id: number
    
    @Column()
    last_temp_artical_id: number

    @Column()
    verify_code: string

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date

    @DeleteDateColumn()
    deleted_at: Date

    @Column()
    amember_id:number

    @Column()
    pic: string
    
    @Column()
    token_for_business: string
    
    @Column()
    login_type: string
}
