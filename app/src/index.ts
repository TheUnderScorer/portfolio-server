import { exceptionHandler, rejectionHandler } from './common/errorHandlers';
import * as dotenv from 'dotenv';
import './services/base';
import { bootstrap } from './app';
import appConfig from './config/appConfig';
import './app';

if ( process.env.NODE_ENV === 'development' ) {
    dotenv.config( {
        path: './.dev.env'
    } );
}

process.on( 'uncaughtException', exceptionHandler );
process.on( 'unhandledRejection', rejectionHandler );

bootstrap( appConfig ).then( () => console.log( 'Application started!' ) );
