import { Application } from 'express';
import { Connection } from 'typeorm';
import { entities } from '../db';

export default async ( app: Application ) =>
{
    console.log( 'Performing cleanup after test...' );

    // Drop database after every test
    const connection = app.get( 'connection' ) as Connection;

    for ( let entity of entities ) {

        try {
            const repo = connection.getRepository( entity.name );

            await repo.clear();
        } catch ( e ) {

        }

    }
}
