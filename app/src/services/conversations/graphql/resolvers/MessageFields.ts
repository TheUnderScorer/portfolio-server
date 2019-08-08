import { FieldResolver, Resolver, Root } from 'type-graphql';
import Message from '../../models/Message';
import { DateFormats } from '../../../../types/DateFormats';

@Resolver( Message )
export default class MessageFields
{

    @FieldResolver()
    public createdAt(
        @Root() message: Message
    ): string
    {
        return message.createdAt.format( DateFormats.DateTime );
    }

}
