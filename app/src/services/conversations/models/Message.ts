import Model from '../../../models/Model';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/models/User';
import Conversation from './Conversation';
import { Field, ID, ObjectType } from 'type-graphql';
import { momentTransformer } from '../../../common/typeorm/transformers';
import * as moment from 'moment';
import { Moment } from 'moment';
import MessageInterface from '../types/MessageInterface';

@Entity()
@ObjectType()
export default class Message extends Model implements MessageInterface
{

    @PrimaryGeneratedColumn()
    @Field( () => ID )
    public id: number;

    @ManyToOne(
        () => User,
        User => User.messages,
        {
            cascade: [ 'remove' ]
        }
    )
    @Field( () => User )
    public author: Promise<User>;

    @ManyToOne(
        () => Conversation,
        Conversation => Conversation.messages,
        {
            cascade: [ 'remove' ]
        }
    )
    @Field( () => Conversation )
    public conversation: Promise<Conversation>;

    @Column()
    @Field()
    public content: string;

    @Column( {
        type:        'datetime',
        transformer: momentTransformer
    } )
    @Field( () => String, { nullable: true } )
    public createdAt: Moment;

    @Column( {
        type:        'datetime',
        transformer: momentTransformer
    } )
    @Field( () => String, { nullable: true } )
    public updatedAt: Moment;

    @BeforeInsert()
    public setCreateDate(): void
    {
        this.createdAt = moment();
    }

    @BeforeUpdate()
    public setUpdateDate(): void
    {
        this.updatedAt = moment();
    }

}
