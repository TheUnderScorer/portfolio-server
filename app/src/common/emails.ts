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
    return transporter.sendMail( options );
};
