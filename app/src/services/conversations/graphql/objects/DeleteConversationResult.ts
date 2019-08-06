import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class DeleteConversationResult
{

    @Field( () => Boolean )
    public result: boolean;

}
