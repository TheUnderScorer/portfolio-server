import { server } from '../app';
import { sendEmail } from './emails';

export const exceptionHandler: NodeJS.UncaughtExceptionListener = async ( error ) =>
{
    console.error( 'Uncaught exception:', error );

    const serializedError = JSON.stringify( error, null, 2 );

    await sendErrorNotification( serializedError );
};

export const rejectionHandler: NodeJS.UnhandledRejectionListener = async ( rejection ) =>
{
    const serializedError = typeof rejection === 'string' ? rejection : JSON.stringify( rejection, null, 2 );

    await sendErrorNotification( serializedError );
};

export const sendErrorNotification = async ( serializedError: string ): Promise<void> =>
{
    const subject = `New error on ${ server.address().toString() }`;
    const text = `Error details: \n ${ serializedError }`;

    await sendEmail( {
        to: process.env.DEV_EMAIL,
        subject,
        text
    } );
};
