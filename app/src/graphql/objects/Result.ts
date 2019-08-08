import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export default class Result
{

    @Field( () => Boolean )
    public result: boolean;

}
