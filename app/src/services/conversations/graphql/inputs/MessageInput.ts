import { Field, ID, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
import MessageInterface from '../../types/MessageInterface';

@InputType()
export default class MessageInput implements Partial<MessageInterface>
{

    @Field( () => ID )
    public conversationID: number;

    @Field()
    @MaxLength( 500 )
    public content: string;

}

