import events from '../../events';
import { Application } from 'express';
import errorHandler from './middleware/errorHandler';
import ErrorResponse from '../../responses/ErrorResponse';
import { ErrorCodes } from '../../types/ErrorCodes';
import { NOT_FOUND } from 'http-status';

const startService = ( app: Application ): void =>
{

    app.all( '*', ( req, res ) =>
    {
        const response = new ErrorResponse();
        response.addMessage( 'Invalid route path.', ErrorCodes.InvalidRoutePath );

        return res.status( NOT_FOUND ).json( response );
    } );

    app.use( errorHandler );

    console.log( 'Base service started!' );

};

events.on( 'app.serverStarted', startService );
