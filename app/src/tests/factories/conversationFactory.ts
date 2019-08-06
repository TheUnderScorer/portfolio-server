import User from '../../services/user/models/User';
import Conversation from '../../services/conversations/models/Conversation';
import * as faker from 'faker'
import userFactory from './userFactory';
import ConversationInterface, { ConversationStatuses } from '../../services/conversations/types/ConversationInterface';

export interface ConversationFactory extends Partial<ConversationInterface>
{
    title?: string;
    author?: User;
    status?: ConversationStatuses
}

export default async (
    {
        title = faker.random.word(),
        author = null,
        status = ConversationStatuses.open
    }: ConversationFactory = {}
): Promise<Conversation> =>
{
    if ( !author ) {
        author = await userFactory();
    }

    const conversation = Conversation.create( { title, status } );
    conversation.author = Promise.resolve( author );

    await conversation.save();

    return conversation;
}
