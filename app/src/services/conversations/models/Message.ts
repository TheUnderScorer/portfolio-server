import Model from '../../../models/Model';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import User from '../../user/models/User';
import Conversation from './Conversation';

@Entity()
export default class Message extends Model
{

    @ObjectIdColumn()
    public _id: ObjectID;

    public author: User;

    public conversation: Conversation;


    @Column()
    public content: string;

    public createdAt: string;

}
