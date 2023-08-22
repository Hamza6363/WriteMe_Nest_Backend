import {
    Entity, Column, PrimaryGeneratedColumn, OneToOne,
    JoinColumn
} from 'typeorm'

@Entity()
export class Auth {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    type: boolean


}