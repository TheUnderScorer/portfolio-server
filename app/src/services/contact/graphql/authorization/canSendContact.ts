import { AuthAction } from '../../../../types/graphql/AuthActions';
import { getUser } from '../../../user/graphql/authorization';
import Contact from '../../models/Contact';
import * as moment from 'moment';
import { MoreThan } from 'typeorm';
import { DateFormats } from '../../../../types/DateFormats';
import RequestError from '../../../../errors/RequestError';
import { ErrorCodes } from '../../../../types/ErrorCodes';

const canSendContact: AuthAction = async ( { req, loaders } ) =>
{
    const currentUser = await getUser( req, loaders.users );

    const searchedDate = moment().subtract( 10, 'minutes' );

    const contact = await Contact.findOne( {
        where: {
            user:      currentUser.id,
            createdAt: MoreThan( searchedDate.format( DateFormats.DateTime ) )
        }
    } );

    if ( contact ) {
        const timeDiff = contact.createdAt.diff( searchedDate, 'minutes' );

        throw new RequestError(
            `You need to wait ${ timeDiff } minutes before sending another e-mail.`,
            ErrorCodes.ContactFormOverload
        )
    }

    return true;
};

export default canSendContact;
