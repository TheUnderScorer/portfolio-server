import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import * as Mail from 'nodemailer/lib/mailer';
import * as nodemailer from 'nodemailer';

export let transporter: Mail;

const setupTransporter = () =>
{
    transporter = nodemailer.createTransport( {
        service: 'gmail',
        auth:    {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
        tls:     {
            rejectUnauthorized: false,
        }
    } )
};

export const sendEmail = async ( options: MailOptions ) =>
{
    if ( !transporter ) {
        setupTransporter();
    }

    if ( !options.from ) {
        options.from = process.env.SITE_EMAIL;
    }

    return await transporter.sendMail( options );
};
