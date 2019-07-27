import Contact from '../models/Contact';
import Exception from '../../../errors/Exception';
import { sendEmail } from '../../../common/emails';

export default async ( contact: Contact, targetEmail: string = process.env.SITE_EMAIL ): Promise<void> =>
{
    if ( !targetEmail ) {
        throw new Exception( 'No target email provided.' );
    }

    const user = await contact.user;

    return await sendEmail( {
        to:      process.env.DEV_EMAIL,
        sender:  user.email,
        subject: contact.subject,
        text:    contact.message,
        html:    contact.message,
    } );
}
