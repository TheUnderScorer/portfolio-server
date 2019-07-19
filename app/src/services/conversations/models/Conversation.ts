import Model from '../../../models/Model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/models/User';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
export default class Conversation extends Model
{

    @PrimaryGeneratedColumn()
    @Field( () => ID )
    public id: number;

    @Column( {
        nullable: true,
    } )
    @Field( {
        nullable: true,
    } )
    public title: string;

    @ManyToOne(
        () => User,
        User => User.conversations
    )
    @Field( () => User )
    public author: Promise<User>;

}
