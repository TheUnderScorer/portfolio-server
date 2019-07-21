import { Field, InputType } from 'type-graphql';
import User from '../../models/User';
import { MinLength } from 'class-validator';

@InputType()
export default class UserInput implements Partial<User>
{
    @Field( {
        nullable: true,
    } )
    public name?: string;

    @Field( {
        nullable: true,
    } )
    public email?: string;

    @Field( {
        nullable: true,
    } )
    @MinLength( 5 )
    public password?: string;
}
