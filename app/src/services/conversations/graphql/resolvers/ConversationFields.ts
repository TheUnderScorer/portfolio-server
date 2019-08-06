import { Args, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import Conversation from '../../models/Conversation';
import Message from '../../models/Message';
import PaginationArgs from '../../../../graphql/args/PaginationArgs';
import { getOffset } from '../../../../common/pagination';
import { loadMany } from '../../../../graphql/common/dataLoader';
import Context from '../../../../types/graphql/Context';

@Resolver( Conversation )
export default class ConversationFields
{

    @FieldResolver( () => [ Message ] )
    public async messages(
        @Root() conversation: Conversation,
        @Args() { page = 1, perPage = 15 }: PaginationArgs,
        @Ctx() { loaders }: Context
    ): Promise<Message[]>
    {
        const messages = await Message.find( {
            where: {
                conversation: conversation.id,
            },
            take:  perPage,
            skip:  getOffset( page, perPage ),
            order: {
                createdAt: 'ASC'
            }
        } );

        loadMany(
            messages,
            message => message.id.toString(),
            loaders.messages
        );

        return messages.reverse();
    }

}
