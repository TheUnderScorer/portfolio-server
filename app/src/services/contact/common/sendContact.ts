import Contact from '../models/Contact';
import Exception from '../../../errors/Exception';
import { sendEmail } from '../../../common/emails';

export default async ( contact: Contact, targetEmail: string = process.env.SITE_EMAIL ): Promise<void> =>
{
    if ( !targetEmail ) {
        throw new Exception( 'No target email provided.' );
    }

    const user = await contact.user;

    const userDetails = JSON.stringify( user.toJSON(), null, 2 );

    return await sendEmail( {
        to:      process.env.DEV_EMAIL,
        from:    user.email,
        sender:  user.email,
        subject: `New message on your portfolio: ${ contact.subject }`,
        text:    `
            ${ contact.message }
            
            User details: 
            ${ userDetails }
        `,
    } );
}
