import { exceptionHandler, rejectionHandler } from './common/errorHandlers';
import events from './events';

const setupHandlers = () =>
{
    process.on( 'uncaughtException', exceptionHandler );
    process.on( 'unhandledRejection', rejectionHandler );
};

events.on( 'app.server.started', setupHandlers );
