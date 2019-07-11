import ErrorResponse from '../../../responses/ErrorResponse';
import { INTERNAL_SERVER_ERROR } from 'http-status';
import RequestError from '../../../errors/RequestError';

export default ( err, req, res, next ) =>
{

    if ( !err ) {

        const errorResponse = new ErrorResponse();
        errorResponse.addMessage( 'Internal server error.' );

        return res.status( INTERNAL_SERVER_ERROR ).json( errorResponse );

    } else {
        let code = INTERNAL_SERVER_ERROR;

        if ( err instanceof RequestError ) {
            code = err.statusCode;
        }

        const errorResponse = ErrorResponse.fromError( err );

        return res.status( code ).json( errorResponse );
    }


};
