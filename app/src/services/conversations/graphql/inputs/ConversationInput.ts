import { Field, InputType } from 'type-graphql';
import Conversation from '../../models/Conversation';

@InputType()
export default class ConversationInput implements Partial<Conversation>
{

    @Field( { nullable: true } )
    public title: string;

}
