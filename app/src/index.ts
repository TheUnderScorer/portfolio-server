import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { bootstrap } from './app';
import './db';
import './errorHandling';
import appConfig from './config/appConfig';

if ( process.env.NODE_ENV === 'development' ) {
    dotenv.config( {
        path: './.dev.env'
    } );
}

bootstrap( appConfig ).then( () => console.log( 'Application started!' ) );
