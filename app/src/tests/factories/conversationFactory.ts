import User from '../../services/user/models/User';
import Conversation from '../../services/conversations/models/Conversation';
import * as faker from 'faker'
import userFactory from './userFactory';

export type ConversationFactory = {
    title?: string;
    author?: User;
}

export default async (
    {
        title = faker.random.word(),
        author = null
    }: ConversationFactory = {}
): Promise<Conversation> =>
{
    if ( !author ) {
        author = await userFactory();
    }

    const conversation = Conversation.create( { title } );
    conversation.author = Promise.resolve( author );

    await conversation.save();

    return conversation;
}
