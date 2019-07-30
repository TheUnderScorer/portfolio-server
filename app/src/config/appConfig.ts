import AppConfig from '../types/AppConfig';
import getContext from '../graphql/getContext';
import { Actions } from '../types/graphql/Actions';
import { canCreateUser } from '../services/user/graphql/authorization';
import UserQueries from '../services/user/graphql/resolvers/UserQueries';
import User from '../services/user/models/User';
import Conversation from '../services/conversations/models/Conversation';
import UserMutations from '../services/user/graphql/resolvers/UserMutations';
import ConversationMutations from '../services/conversations/graphql/resolvers/ConversationMutations';
import Message from '../services/conversations/models/Message';
import ConversationQueries from '../services/conversations/graphql/resolvers/ConversationQueries';
import ConversationSubscriptions from '../services/conversations/graphql/resolvers/ConversationSubscriptions';
import Contact from '../services/contact/models/Contact';
import ContactMutations from '../services/contact/graphql/resolvers/ContactMutations';
import canSendContact from '../services/contact/graphql/authorization/canSendContact';
import canChangeStatus from '../services/conversations/graphql/authorization/canChangeStatus';
import ConversationFields from '../services/conversations/graphql/resolvers/ConversationFields';
import UserFields from '../services/user/graphql/resolvers/UserFields';
import canCreateConversation from '../services/conversations/graphql/authorization/canCreateConversation';
import MessageMutations from '../services/conversations/graphql/resolvers/MessageMutations';
import MessageSubscriptions from '../services/conversations/graphql/resolvers/MessageSubscriptions';
import canSendMessage from '../services/conversations/graphql/authorization/canSendMessage';

const appConfig: AppConfig = {
    contextProvider: getContext(),
    schemaOptions:   {
        resolvers: [
            UserQueries,
            UserMutations,
            UserFields,
            ConversationMutations,
            ConversationQueries,
            ConversationFields,
            ConversationSubscriptions,
            ContactMutations,
            MessageMutations,
            MessageSubscriptions
        ]
    },
    authActions:     {
        [ Actions.CreateUser ]:               canCreateUser,
        [ Actions.SendContact ]:              canSendContact,
        [ Actions.ChangeConversationStatus ]: canChangeStatus,
        [ Actions.CreateConversation ]:       canCreateConversation,
        [ Actions.SendMessage ]:              canSendMessage
    },
    entities:        [ User, Conversation, Message, Contact ]
};

export default appConfig;
