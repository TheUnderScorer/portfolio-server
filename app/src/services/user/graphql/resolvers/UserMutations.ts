import { Arg, Authorized, Ctx, ID, Mutation, Resolver } from 'type-graphql';
import User from '../../models/User';
import Context from '../../../../types/graphql/Context';
import { Actions } from '../../../../types/graphql/Actions';
import UserInput from '../inputs/UserInput';
import * as requestIp from 'request-ip';
import * as moment from 'moment';
import events from '../../../../events';
import { getUser } from '../authorization';
import { UserRole } from '../../types/UserRole';
import DataLoader from '../../../../common/DataLoader';
import { validate } from '../../../../common/google/recaptcha';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';

@Resolver( User )
export default class UserResolver
{

    private static async updateUserData( user: User, input: UserInput, loader: DataLoader<string, User> ): Promise<User>
    {
        if ( !user.didCaptcha ) {
            const captchaResult = await validate( input.captcha );

            if ( !captchaResult ) {
                throw new RequestError( 'Invalid captcha validation result.', ErrorCodes.InvalidCaptchaResult )
            } else {
                user.didCaptcha = true;
            }
        }

        const updatedUser = Object.assign( user, input );
        loader.update( updatedUser );

        await user.save();

        return updatedUser;
    }

    @Mutation( () => User )
    @Authorized( { action: Actions.CreateUser } )
    public async createUser(
        @Arg( 'userInput', { nullable: true } ) userInput: UserInput = {},
        @Ctx() { req, loaders }: Context ): Promise<User>
    {
        const user = User.create( {
            ...userInput,
            ip:        requestIp.getClientIp( req ),
            lastLogin: moment(),
            role:      UserRole.user
        } );

        await user.save();

        loaders.users.prime( user.id.toString(), user );

        events.emit( 'app.users.userCreated', user, { req, loaders } );

        return user;
    }

    @Mutation( () => User )
    public async updateMe(
        @Arg( 'userInput' ) userInput: UserInput,
        @Ctx() { req, loaders }: Context
    ): Promise<User>
    {
        const currentUser = await getUser( req, loaders.users );

        return UserResolver.updateUserData( currentUser, userInput, loaders.users );
    }

    @Mutation( () => User )
    @Authorized( { role: UserRole.administrator } )
    public async updateUser(
        @Arg( 'id', () => ID ) id: number,
        @Arg( 'userInput' ) userInput: UserInput,
        @Ctx() { loaders }: Context
    ): Promise<User>
    {
        const user = await loaders.users.load( id.toString() );

        return UserResolver.updateUserData( user, userInput, loaders.users );
    }

    @Mutation( () => User )
    public async updateLoginDate( @Ctx() { req, loaders }: Context ): Promise<User>
    {
        const user = await getUser( req, loaders.users );
        await user.updateLastLogin();

        return user;
    }

}
