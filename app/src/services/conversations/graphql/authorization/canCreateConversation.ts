import { AuthAction } from '../../../../types/graphql/AuthActions';
import Conversation from '../../models/Conversation';
import { getUser } from '../../../user/graphql/authorization';
import { ConversationStatuses } from '../../types/ConversationInterface';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';

const canCreateConversation: AuthAction = async ( { context: { req, loaders: { users } } } ) =>
{
    const user = await getUser( req, users );

    const conversationsCount = await Conversation.count( {
        where: {
            author: user.id,
            status: ConversationStatuses.open
        }
    } );

    if ( conversationsCount > 0 ) {
        throw new RequestError(
            'Cannot open more than one conversation.',
            ErrorCodes.CannotOpenMoreThanOneConversation
        );
    }

    return true;
};

export default canCreateConversation;
