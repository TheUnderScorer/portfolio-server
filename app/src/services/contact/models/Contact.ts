import Model from '../../../models/Model';
import ContactInterface from '../types/ContactInterface';
import * as moment from 'moment';
import { Moment } from 'moment';
import User from '../../user/models/User';
import { BeforeInsert, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { momentTransformer } from '../../../common/typeorm/transformers';

@Entity()
@ObjectType()
export default class Contact extends Model implements ContactInterface
{

    @Field( () => ID )
    @PrimaryGeneratedColumn()
    public id: number;

    @Field()
    @Column()
    public message: string;

    @Field( () => String )
    @Column( {
        type:        'datetime',
        transformer: momentTransformer
    } )
    public createdAt: Moment;

    @Field()
    @Column()
    public subject: string;

    @Field( () => User )
    @ManyToOne(
        () => User,
        User => User.contacts,
    )
    public user: Promise<User>;

    @BeforeInsert()
    public setCreateDate()
    {
        this.createdAt = moment();
    }

}
