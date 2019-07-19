import { Args, Ctx, FieldResolver, Info, Query, Resolver, Root } from 'type-graphql';
import User from '../../models/User';
import { getOffset } from '../../../../common/pagination';
import Context from '../../../../types/graphql/Context';
import PaginationArgs from '../../../../graphql/args/PaginationArgs';
import Conversation from '../../../conversations/models/Conversation';
import { loadMany } from '../../../../graphql/common/dataLoader';
import * as graphqlFields from 'graphql-fields';

@Resolver( User )
export default class UserQueries
{

    @Query( () => [ User ] )
    public async getUsers(
        @Args() { perPage = 15, page = 1 }: PaginationArgs,
        @Ctx() { loaders }: Context,
        @Info() info,
    ): Promise<User[]>
    {
        const fields = Object.keys( graphqlFields( info ) );

        const relations = [];

        if ( fields.includes( 'conversations' ) ) {
            relations.push( 'conversations' );
        }

        const users = await User.find( {
            take: perPage,
            skip: getOffset( page, perPage ),
            relations
        } );

        loadMany(
            users,
            user => user.id.toString(),
            loaders.users,
        );

        return users;
    }

    @FieldResolver( () => [ Conversation ] )
    public async conversations( @Root() user: User, @Ctx() { loaders }: Context ): Promise<Conversation[]>
    {
        const conversations = await user.conversations;

        loadMany(
            conversations,
            conversation => conversation.id.toString(),
            loaders.conversations
        );

        return conversations;
    }

}
