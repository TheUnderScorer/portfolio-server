import Model from '../../../models/Model';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/models/User';
import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';
import Message from './Message';
import * as moment from 'moment';
import { Moment } from 'moment';
import { momentTransformer } from '../../../common/typeorm/transformers';
import ConversationInterface, { ConversationStatuses } from '../types/ConversationInterface';

registerEnumType( ConversationStatuses, {
    name:        'ConversationStatuses',
    description: 'Current status of conversation'
} );

@Entity()
@ObjectType( {
    description: 'Describes conversation model'
} )
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
    @Field( () => [ Message ], { nullable: true } )
    public messages: Promise<Message[]>;

    @Column( {
        type:        'datetime',
        transformer: momentTransformer
    } )
    @Field( () => String, { nullable: true } )
    public createdAt: Moment;

    @Column( {
        type:   'varchar',
        length: 7
    } )
    @Field( () => ConversationStatuses )
    public status: ConversationStatuses = ConversationStatuses.open;

    @BeforeInsert()
    public setCreateDate()
    {
        this.createdAt = moment()
    }

}
