import { Field, InputType } from 'type-graphql';
import { MaxLength } from 'class-validator';
import ConversationInterface from '../../types/ConversationInterface';

@InputType()
export default class ConversationInput implements Partial<ConversationInterface>
{

    @Field( { nullable: true } )
    @MaxLength( 100 )
    public title?: string;

}
