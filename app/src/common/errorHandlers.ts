export const exceptionHandler: NodeJS.UncaughtExceptionListener = async ( error ) =>
{
    const serializedError = JSON.stringify( error, null, 2 );

    await sendErrorNotification( serializedError );
};

export const rejectionHandler: NodeJS.UnhandledRejectionListener = async ( rejection ) =>
{
    const serializedError = typeof rejection === 'string' ? rejection : JSON.stringify( rejection, null, 2 );

    await sendErrorNotification( serializedError );
};

const sendErrorNotification = async ( serializedError: string ): Promise<void> =>
{

};
