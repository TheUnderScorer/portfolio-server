export default class EmptyTokenError extends Error
{

    public name: string = 'EmptyToken';
    public message: string = 'No token provided.';

}
