import Model from '../../../models/Model';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/models/User';
import { Field, ID, ObjectType } from 'type-graphql';
import Message from './Message';
import * as moment from 'moment';
import { Moment } from 'moment';
import { momentTransformer } from '../../../common/typeorm/transformers';
import ConversationInterface from '../types/ConversationInterface';

@Entity()
@ObjectType()
export default class Conversation extends Model implements ConversationInterface
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
        User => User.conversations,
        {
            cascade: [ 'remove' ]
        }
    )
    @Field( () => User )
    public author: Promise<User>;

    @OneToMany(
        () => Message,
        Message => Message.conversation
    )
    @Field( () => [ Message ] )
    public messages: Promise<Message[]>;

    @Column( {
        type:        'datetime',
        transformer: momentTransformer
    } )
    @Field( () => String, { nullable: true } )
    public createdAt: Moment;

    @BeforeInsert()
    public setCreateDate()
    {
        this.createdAt = moment()
    }

}
