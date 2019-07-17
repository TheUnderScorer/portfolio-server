import { ContextFunction } from 'apollo-server-core';

export default interface AppConfig
{
    contextProvider: ContextFunction
}
