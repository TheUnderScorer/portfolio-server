import { Args, Ctx, Query, Resolver } from 'type-graphql';
import Conversation from '../../models/Conversation';
import Context from '../../../../types/graphql/Context';
import { getUser } from '../../../user/graphql/authorization';
import PaginationArgs from '../../../../graphql/args/PaginationArgs';
import { getOffset } from '../../../../common/pagination';
import events from '../../../../events';

@Resolver( Conversation )
export default class ConversationQueries
{

    // TODO Tests
    @Query( () => [ Conversation ] )
    public async myConversations(
        @Args() { page = 1, perPage = 15 }: PaginationArgs,
        @Ctx() { loaders, req }: Context
    ): Promise<Conversation[]>
    {
        const user = await getUser( req, loaders.users );

        const conversations = await Conversation.find( {
            where: {
                author: user.id
            },
            take:  perPage,
            skip:  getOffset( page, perPage )
        } );

        events.emit( 'app.conversations.myConversations', conversations, { req, loaders } );

        return conversations;
    }

}
