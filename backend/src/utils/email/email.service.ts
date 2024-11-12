import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as MailerMain } from '@nestjs-modules/mailer';
import { MailService } from './IMailService';
import { CreateEmailServerDto } from './Dto/createEmailServerDto';
import { accountCreationTemplate } from './templates/accountCreation';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { ConfirmationEmailDto } from './Dto/ConfirmationEmailDto';
import { confirmationEmailTemplate } from './templates/confirmationEMail';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class EmailServerService implements MailService {
  private readonly logger = new CustomLogger();

  constructor(
    private readonly mailerMain: MailerMain,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(email: CreateEmailServerDto): Promise<void> {
    try {
      console.log('enter Send Mail');
      const renderedTemplate = this._bodyTemplate(email.userName);
      const plainText = `Hello ${email.userName}, your account was successfully created!`;
      console.log('after Template');
      const toReturn = await this._processSendEmail(
        email.to,
        email.subject,
        plainText,
        renderedTemplate,
      );
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException('an error occurred', error);
    }
  }

  private _bodyTemplate(userName: string): string {
    // Use the template function to generate the HTML content
    return accountCreationTemplate({
      userName: userName,
    });
  }
  private _confirmMailTemplate(url: string, name:string): string {
    // Use the template function to generate the HTML content
    return confirmationEmailTemplate({
      url: url,
      name: name,
    });
  }

  //UNCOMMENT FOR TESTS
  async sendMailSandBox(email: CreateEmailServerDto): Promise<void> {
    //   // Generate the template directly using the data
    //   const renderedTemplate = this._bodyTemplate();
    //
    //   // Send the email with the rendered HTML
    //   await this._processSendEmail(
    //     email.to,
    //     email.subject,
    //     email.text,
    //     renderedTemplate,
    //   );
    // }
    //
    // /**
    //  * Generate the HTML email body from the given data using a template.
    //  *
    //  * @param {Object} data - The data object to be passed to the template.
    //  * @return {string} The rendered HTML template.
    //  */
    // _bodyTemplate(): string {
    //   // Use the template function to generate the HTML content
    //   return accountCreationTemplate({
    //     userName: 'Antoine',
    //   });
  }

  async sendInternalServerErrorNotification(details: {
    message: string;
    url: string;
    method: string;
    timestamp: string;
  }) {
    console.log('Send mail internal server error');
    const subject = `Internal Server Error: ${details.url}`;
    const body = `
      An internal server error occurred:
      - URL: ${details.url}
      - Method: ${details.method}
      - Message: ${details.message}
      - Timestamp: ${details.timestamp}
    `;

    await this._processSendEmail(process.env.ADMIN_MAIL, subject, body, body);
  }

  async sendConfirmationEmail(email: ConfirmationEmailDto): Promise<void> {
    try {
      const token = this.jwtService.sign(
        { email: email.to },
        {
          secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
          expiresIn: '2100s',
        },
      );

      const url = `${process.env.FRONTEND_URL}/token/${token}`;

      const renderedTemplate = this._confirmMailTemplate(url, email.userName);
      const plainText = `Welcome to Arvest. To confirm the email address, click here: ${url}`;

      const toReturn = await this._processSendEmail(
        email.to,
        email.subject,
        plainText,
        renderedTemplate,
      );
      return toReturn;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException('an error occurred', error);
    }
  }

  async _processSendEmail(to, subject, text, body): Promise<void> {
    try {
      console.log('before sending mail');
      console.log('to');
      console.log(to);
      console.log('subject');
      console.log(subject);
      console.log('text');
      console.log(text);
      console.log('body');
      console.log(body);

      await this.mailerMain.sendMail({
        to: to,
        subject: subject,
        text: text,
        html: body,
      });
      console.log('Email sent');
    } catch (error) {
      console.log('Error sending email', error);
      throw new InternalServerErrorException('Failed to send email', error);
    }
  }
}
