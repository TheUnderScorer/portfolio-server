import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import User from '../../models/User';
import Context from '../../../../types/graphql/Context';
import { Actions } from '../../../../types/graphql/Actions';
import UserInput from '../inputs/UserInput';
import * as requestIp from 'request-ip';
import * as moment from 'moment';
import events from '../../../../events';

@Resolver( User )
export default class UserResolver
{

    @Mutation( () => User )
    @Authorized( { action: Actions.CreateUser } )
    public async createUser(
        @Arg( 'userInput' ) userInput: UserInput,
        @Ctx() { req, loaders }: Context ): Promise<User>
    {
        const user = User.create( {
            ...userInput,
            ip:        requestIp.getClientIp( req ),
            lastLogin: moment(),
            role:      'user'
        } );

        await user.save();

        loaders.users.prime( user.id.toString(), user );

        events.emit( 'app.users.userCreated', user, { req, loaders } );

        return user;
    }

}
