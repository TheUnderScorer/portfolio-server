import { AuthAction } from '../../../../types/graphql/AuthActions';
import { getUser } from '../../../user/graphql/authorization';
import Conversation from '../../models/Conversation';
import { UserRole } from '../../../user/types/UserRole';
import { ConversationStatuses } from '../../types/ConversationInterface';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';

const canChangeStatus: AuthAction = async ( { context, args = {} } ) =>
{
    const { conversationID, status } = args;
    const { loaders: { conversations, users }, req } = context;

    const currentUser = await getUser( req, users );

    if ( currentUser.role === UserRole.administrator ) {
        return true;
    }

    const conversation = await Conversation.findOneOrFail( {
        where: {
            id:   conversationID,
            user: currentUser.id
        }
    } );

    if ( conversation.status === ConversationStatuses.closed && status === ConversationStatuses.open ) {
        throw new RequestError(
            'You cannot open closed conversation',
            ErrorCodes.CannotOpenConversation
        )
    }

    conversations.prime(
        conversation.id.toString(),
        conversation
    );

    return true;
};

export default canChangeStatus;
