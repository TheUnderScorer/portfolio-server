import { sendEmail } from './emails';

export const exceptionHandler: NodeJS.UncaughtExceptionListener = async ( error ) =>
{
    console.error( 'Uncaught exception:', error );

    const serializedError = JSON.stringify( error, null, 2 );

    await sendErrorNotification( serializedError );
};

export const rejectionHandler: NodeJS.UnhandledRejectionListener = async ( rejection ) =>
{
    console.error( 'Unhanded rejection:', rejection );

    const serializedError = typeof rejection === 'string' ? rejection : JSON.stringify( rejection, null, 2 );

    await sendErrorNotification( serializedError );
};

export const sendErrorNotification = async ( serializedError: string ): Promise<void> =>
{
    const subject = `New error on ${ process.env.SERVER_URL }`;
    const text = `Error details: \n ${ serializedError }`;

    await sendEmail( {
        to: process.env.DEV_EMAIL,
        subject,
        text
    } );
};
