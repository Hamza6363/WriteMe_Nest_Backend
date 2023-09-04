import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn,
    JoinColumn
} from 'typeorm'

@Entity()
export class OauthAccessToken {

    @PrimaryGeneratedColumn()
    id: string
    
    @Column()
    token_id: string

    @Column({ type: 'bigint' })
    user_id: number
  
    @Column({ type: 'bigint' })
    client_id: number
    
    @Column()
    name : string

    @Column({ type: 'text' })
    scopes : string
    
    @Column({ type: 'tinyint' })
    revoked : number
    
    @CreateDateColumn({type: 'timestamp'})
    createdAt: Date

    @UpdateDateColumn({type: 'timestamp'})
    updated_at: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    expires_at: Date;
}