import Context from './Context';
import { ResolverData } from 'type-graphql';

export type AuthActions = {
    [ key: string ]: AuthAction;
};

export type AuthAction = ( data: ResolverData<Context> ) => Promise<boolean>;
