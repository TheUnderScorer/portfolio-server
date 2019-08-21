import axios from 'axios';

const baseURL = 'https://www.google.com/recaptcha/api/siteverify';

export const recaptchaClient = axios.create( {
    baseURL,
} );

export const validate = async ( userResponse: string ): Promise<boolean> =>
{
    try {
        const { data, status } = await recaptchaClient.post( '', {}, {
            params: {
                response: userResponse,
                secret:   process.env.RECAPTCHA_SECRET
            }
        } );

        return status === 200 && !!data.success;
    } catch ( e ) {
        console.error( e );

        throw  e;
    }
};
