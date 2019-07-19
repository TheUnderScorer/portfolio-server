import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export default class PaginationArgs
{

    @Field( () => Int, { nullable: true } )
    public perPage?: number;

    @Field( () => Int, { nullable: true } )
    public page?: number;

}
