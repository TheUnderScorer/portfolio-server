import { ValidationChain } from 'express-validator/check';
import AppConfig from './AppConfig';

export default interface RequestField
{
    readonly name: string;
    readonly validation?: ( validator: ValidationChain, config?: AppConfig ) => void;
}
