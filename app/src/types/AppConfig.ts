import { ContextFunction } from 'apollo-server-core';
import { AuthActions } from './graphql/AuthActions';
import { BuildSchemaOptions } from 'type-graphql';
import Model from '../models/Model';

export default interface AppConfig
{
    contextProvider?: ContextFunction;
    authActions?: AuthActions;
    schemaOptions?: BuildSchemaOptions;
    entities: Array<typeof Model>
}
