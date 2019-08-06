import { ValueTransformer } from 'typeorm';
import * as moment from 'moment'
import { Moment } from 'moment'
import { DateFormats } from '../../types/DateFormats';

export const momentTransformer: ValueTransformer = {
    from: value => value ? moment( value ) : undefined,
    to:   ( value: Moment ) =>
          {
              if ( !value ) {
                  return value;
              }

              if ( !!value.format ) {
                  return value.format( DateFormats.DateTime );
              }

              return value;
          },
};
