import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import Contact from '../../models/Contact';
import ContactInput from '../inputs/ContactInput';
import Context from '../../../../types/graphql/Context';
import { getUser } from '../../../user/graphql/authorization';
import User from '../../../user/models/User';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';
import sendContact from '../../common/sendContact';
import { Actions } from '../../../../types/graphql/Actions';

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

    @Authorized( { action: Actions.SendContact } )
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

        try {
            await sendContact( contact )
        } catch ( e ) {
            contact.remove();

            throw e;
        }

        return contact;
    }

}
