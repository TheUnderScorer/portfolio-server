import Conversation from '../../models/Conversation';
import { Field, ID, InputType } from 'type-graphql';
import { ConversationStatuses } from '../../types/ConversationInterface';

@InputType()
export default class ChangeConversationStatusInput implements Partial<Conversation>
{

    @Field( () => ID )
    public id: number;

    @Field( () => ConversationStatuses )
    public status: ConversationStatuses;

    @Field( {
        nullable:    true,
        description: 'Optional e-mail, if user have not provided one previously.'
    } )
    public email?: string;

    @Field( {
        nullable: true,
    } )
    public sendTranscript?: boolean;

}
