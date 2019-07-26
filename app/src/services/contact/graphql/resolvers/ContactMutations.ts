import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import Contact from '../../models/Contact';
import ContactInput from '../inputs/ContactInput';
import Context from '../../../../types/graphql/Context';
import { getUser } from '../../../user/graphql/authorization';
import User from '../../../user/models/User';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';
import sendContact from '../../common/sendContact';
import { INTERNAL_SERVER_ERROR } from 'http-status';

@Resolver( Contact )
export default class ContactMutations
{

    protected static async handleEmail( user: User, email: string ): Promise<void>
    {
        if ( user.email ) {
            return;
        }

        if ( !email ) {
            throw new RequestError( `No e-mail set for user ${ user.id } and no e-mail provided in request.`, ErrorCodes.NoEmailProvided );
        }

        user.email = email;
        await user.save();
    }

    @Mutation( () => Contact )
    public async send(
        @Arg( 'contactInput' ) { email = '', ...input }: ContactInput,
        @Ctx() { req, loaders }: Context
    ): Promise<Contact>
    {
        const user = await getUser( req, loaders.users );

        await ContactMutations.handleEmail( user, email );

        const contact = Contact.create( { ...input } );
        contact.user = Promise.resolve( user );
        await contact.save();

        if ( !await sendContact( contact ) ) {
            await contact.remove();

            throw new RequestError(
                'Error while sending e-mail.',
                ErrorCodes.EmailSendingError,
                INTERNAL_SERVER_ERROR
            )
        }

        return contact;
    }

}
