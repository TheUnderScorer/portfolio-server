import { ErrorCodes } from './ErrorCodes';

export interface ErrorMessage
{
    msg: string;
    code?: ErrorCodes | string;
    field?: string;
}
