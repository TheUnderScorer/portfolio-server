import Context from './Context';

export type AuthActions = {
    [ key: string ]: AuthAction;
};

export type AuthAction = ( context: Context ) => Promise<boolean>;
