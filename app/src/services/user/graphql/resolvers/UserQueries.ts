import { Arg, Args, Authorized, Ctx, ID, Info, Query, Resolver } from 'type-graphql';
import User from '../../models/User';
import { getOffset } from '../../../../common/pagination';
import Context from '../../../../types/graphql/Context';
import PaginationArgs from '../../../../graphql/args/PaginationArgs';
import * as graphqlFields from 'graphql-fields';
import { UserRole } from '../../types/UserRole';
import { getUser } from '../authorization';

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

        loaders.users.saveMany( users );

        return users;
    }

    @Authorized( { role: UserRole.administrator } )
    @Query( () => User )
    public async getUser(
        @Arg( 'id', () => ID ) id: number,
        @Ctx() { loaders }: Context
    )
    {
        return await loaders.users.load( id.toString() );
    }

    @Query( () => User )
    public async me( @Ctx() { loaders, req }: Context ): Promise<User>
    {
        return await getUser( req, loaders.users );
    }

}
