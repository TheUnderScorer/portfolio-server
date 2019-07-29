import { Field, InputType } from 'type-graphql';
import Conversation from '../../models/Conversation';
import { MaxLength } from 'class-validator';

@InputType()
export default class ConversationInput implements Partial<Conversation>
{

    @Field( { nullable: true } )
    @MaxLength( 100 )
    public title?: string;

}
