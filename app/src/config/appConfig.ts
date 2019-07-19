import AppConfig from '../types/AppConfig';
import getContext from '../graphql/getContext';
import { Actions } from '../types/graphql/Actions';
import { canCreateUser } from '../services/user/graphql/authorization';
import UserQueries from '../services/user/graphql/resolvers/UserQueries';
import User from '../services/user/models/User';
import Conversation from '../services/conversations/models/Conversation';
import UserMutations from '../services/user/graphql/resolvers/UserMutations';
import ConversationMutations from '../services/conversations/graphql/resolvers/ConversationMutations';

const appConfig: AppConfig = {
    contextProvider: getContext(),
    schemaOptions:   {
        resolvers: [ UserQueries, UserMutations, ConversationMutations ]
    },
    authActions:     {
        [ Actions.CreateUser ]: canCreateUser,
    },
    entities:        [ User, Conversation ]
};

export default appConfig;
