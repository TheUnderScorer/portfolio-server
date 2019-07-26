import { UserRole } from '../types/UserRole';
import UserInterface from '../types/UserInterface';
import * as bcrypt from 'bcrypt';
import { sign } from '../../../common/jwt';
import * as moment from 'moment';
import { Moment } from 'moment';
import Model from '../../../models/Model';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Authorized, Field, ID, ObjectType } from 'type-graphql';
import Conversation from '../../conversations/models/Conversation';
import TokenInterface from '../types/Token';
import Token from '../graphql/objects/Token';
import Message from '../../conversations/models/Message';
import { momentTransformer } from '../../../common/typeorm/transformers';
import ContactInterface from '../../contact/types/ContactInterface';
import Contact from '../../contact/models/Contact';

@Entity()
@ObjectType()
export default class User extends Model implements UserInterface
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
    public name: string;

    @Column( {
        nullable:    true,
        transformer: momentTransformer,
        type:        'datetime'
    } )
    @Field(
        () => String, {
            nullable: true,
        } )
    public lastLogin: Moment;

    @Column( {
        type:   'varchar',
        length: 20
    } )
    @Field( () => String )
    public role: UserRole = UserRole.user;

    @Column( {
        nullable: true
    } )
    @Field( {
        nullable: true,
    } )
    @Authorized( { role: 'administrator' } )
    public password: string;

    @Column()
    @Field()
    @Authorized( { role: 'administrator' } )
    public ip: string;

    @Column( {
        nullable: true
    } )
    @Field( {
        nullable: true,
    } )
    public email: string;

    @OneToMany(
        () => Conversation,
        Conversation => Conversation.author
    )
    @Field( () => [ Conversation ], { nullable: true } )
    public conversations: Promise<Conversation[]>;

    @OneToMany(
        () => Message,
        Message => Message.author
    )
    @Field( () => [ Message ], { nullable: true } )
    public messages: Promise<Message[]>;

    @OneToMany(
        () => Contact,
        Contact => Contact.user
    )
    @Field( () => [ Contact ], { nullable: true } )
    public contacts: Promise<ContactInterface[]>;

    @BeforeUpdate()
    @BeforeInsert()
    public hashPassword(): void
    {
        if ( !this.password ) {
            return;
        }

        this.password = bcrypt.hashSync( this.password, parseInt( process.env.PASSWORD_SALT_ROUNDS ) );
    }

    public comparePasswords( password: string ): boolean
    {
        return bcrypt.compareSync( password, this.password );
    }

    @Field( () => Token, { nullable: true } )
    public get token(): Token
    {
        return this.createToken();
    }

    @Field()
    public get hasPassword(): boolean
    {
        return !!this.password;
    }

    public createToken(): TokenInterface
    {
        return sign( {
            id: this.id.toString()
        } )
    }

    @BeforeInsert()
    public async updateLastLogin(): Promise<void>
    {
        this.lastLogin = moment();
    }

}
