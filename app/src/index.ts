import 'reflect-metadata';
import { exceptionHandler, rejectionHandler } from './common/errorHandlers';
import * as dotenv from 'dotenv';
import { bootstrap } from './app';
import appConfig from './config/appConfig';
import './app';
import './db';
import './services/user';

if ( process.env.NODE_ENV === 'development' ) {
    dotenv.config( {
        path: './.dev.env'
    } );
}

process.on( 'uncaughtException', exceptionHandler );
process.on( 'unhandledRejection', rejectionHandler );

bootstrap( appConfig ).then( () => console.log( 'Application started!' ) );
