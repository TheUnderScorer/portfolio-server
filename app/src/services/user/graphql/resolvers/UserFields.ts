import { Args, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import User from '../../models/User';
import Conversation from '../../../conversations/models/Conversation';
import PaginationArgs from '../../../../graphql/args/PaginationArgs';
import Context from '../../../../types/graphql/Context';
import { getOffset } from '../../../../common/pagination';

@Resolver( User )
export default class UserFields
{

    @FieldResolver( () => [ Conversation ] )
    public async conversations(
        @Root() user: User,
        @Args() { perPage = 15, page = 1 }: PaginationArgs,
        @Ctx() { loaders }: Context ): Promise<Conversation[]>
    {
        const conversations = await Conversation.find( {
            where: {
                author: user.id
            },
            take:  perPage,
            skip:  getOffset( page, perPage )
        } );

        loaders.conversations.saveMany( conversations );

        return conversations;
    }

}
