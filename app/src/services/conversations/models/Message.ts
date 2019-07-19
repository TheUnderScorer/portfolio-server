import Model from '../../../models/Model';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from '../../user/models/User';
import Conversation from './Conversation';
import { Field, ID, ObjectType } from 'type-graphql';
import { momentTransformer } from '../../../common/typeorm/transformers';
import { Moment } from 'moment';

@Entity()
@ObjectType()
export default class Message extends Model
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
    public author: User;

    @ManyToOne(
        () => Conversation,
        Conversation => Conversation.messages,
        {
            cascade: [ 'remove' ]
        }
    )
    @Field( () => Conversation )
    public conversation: Conversation;

    @Column()
    @Field()
    public content: string;

    @Column( {
        type:        'timestamp',
        transformer: momentTransformer,
        default:     () => 'CURRENT_TIMESTAMP()'
    } )
    @Field( () => String )
    public createdAt: Moment;

    @Column( {
        type:        'timestamp',
        transformer: momentTransformer,
        default:     () => 'CURRENT_TIMESTAMP()'
    } )
    @Field( () => String )
    public modifiedAt: Moment;

}
