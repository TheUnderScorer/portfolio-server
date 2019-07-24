import { Field, InputType } from 'type-graphql';
import Contact from '../../models/Contact';
import { IsEmail, MaxLength, MinLength } from 'class-validator';

@InputType()
export default class ContactInput implements Partial<Contact>
{

    @Field()
    @MaxLength( 50 )
    public subject: string;

    @MinLength( 20 )
    @Field()
    public content: string;

    @Field( {
        nullable:    true,
        description: 'Optional, only if user have not provided any email yet',
    } )
    @IsEmail()
    public email ?: string;

}
