import User from '../../../user/models/User';
import Conversation from '../../models/Conversation';
import { ConversationStatuses } from '../../types/ConversationInterface';

/**
 * Fetches conversation that is currently open for provided user.
 * */
export default async ( user: User ): Promise<Conversation> =>
{
    return await Conversation.findOne( {
        where: {
            author: user.id,
            status: ConversationStatuses.open
        }
    } );
}
