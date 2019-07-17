import { body, ValidationChain, ValidationChainBuilder } from 'express-validator/check';
import AppConfig from '../types/AppConfig';
import RequestField from '../types/RequestField';

/**
 * @function Builds validation rules for provided fields
 * */
export default ( fields: RequestField[], config: AppConfig, validationBuilder: ValidationChainBuilder = null ): ValidationChain[] =>
{

    if ( !validationBuilder ) {
        validationBuilder = body;
    }

    const validators = [];

    fields.forEach( ( { name, validation } ) =>
    {

        const validator = validationBuilder( name );

        if ( validation ) {
            validation( validator, config );
        }

        validators.push( validator );

    } );

    return validators;

}
