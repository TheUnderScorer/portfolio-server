import { CorsOptions } from 'cors';

const corsConfig: CorsOptions = {
    optionsSuccessStatus: 200,
    origin:               ( origin, callback ) =>
                          {

                              if ( process.env.NODE_ENV === 'development' ) {
                                  callback( null, true );

                                  return;
                              }

                              const whitelist = process.env.HOSTS_WHITELIST.split( ',' );

                              if ( !whitelist.includes( origin ) ) {
                                  callback( new Error( 'This host origin is not allowed.' ) )
                              } else {
                                  callback( null, true );
                              }

                          }
};

export default corsConfig;
