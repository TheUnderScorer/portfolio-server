import { BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { UserRole } from '../types/UserRole';
import UserInterface from '../types/UserInterface';
import * as bcrypt from 'bcrypt';
import { DateFormats } from '../../../types/DateFormats';
import Model from '../../../models/Model';
import Token from '../types/Token';
import { sign } from '../../../common/jwt';
import * as moment from 'moment';
import { Moment } from 'moment';

@Entity()
export default class User extends Model implements UserInterface
{
    @ObjectIdColumn()
    public id: ObjectID;

    @Column( {
        nullable: true,
    } )
    public name: string;

    @Column( {
        nullable: true,
    } )
    public lastLogin: string;

    @Column()
    public role: UserRole = 'user';

    @Column( {
        nullable: true
    } )
    public password: string;

    @Column()
    public ip: string;

    @Column( {
        nullable: true
    } )
    public email: string;

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

    public createToken(): Token
    {
        return sign( {
            id: this.id.toString()
        } )
    }

    public getLastLogin(): Moment
    {
        return moment( this.lastLogin );
    }

    @BeforeInsert()
    public async updateLastLogin(): Promise<void>
    {
        this.lastLogin = moment().format( DateFormats.DateTime );
    }

    public toJSON(): any
    {
        const json = super.toJSON();

        if ( typeof json.lastLogin === 'object' ) {
            json.lastLogin = json.lastLogin.format( DateFormats.DateTime );
        }

        return json;
    }

}
