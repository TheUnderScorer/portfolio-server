import * as nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';

const transporter = nodemailer.createTransport( {
    service: 'gmail',
    auth:    {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    }
} );

export const sendEmail = async ( options: MailOptions ) =>
{
    if ( !options.from ) {
        options.from = process.env.SITE_EMAIL;
    }

    return await transporter.sendMail( options );
};
