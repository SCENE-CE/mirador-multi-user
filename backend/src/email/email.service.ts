import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as MailerMain } from '@nestjs-modules/mailer';
import { MailService } from './IMailService';
import { CreateEmailServerDto } from './Dto/createEmailServerDto';
import { accountCreationTemplate } from './templates/accountCreation';
import { CustomLogger } from '../Logger/CustomLogger.service';
@Injectable()
export class EmailServerService implements MailService {
  private readonly logger = new CustomLogger();

  constructor(private readonly mailerMain: MailerMain) {}

  async sendMail(email: CreateEmailServerDto): Promise<void> {
    try{
      const renderedTemplate = this._bodyTemplate(email.userName);
      const plainText = `Hello ${email.userName}, your account was successfully created!`;

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
    console.log('Send mail internal server error')
    const subject = `Internal Server Error: ${details.url}`;
    const body = `
      An internal server error occurred:
      - URL: ${details.url}
      - Method: ${details.method}
      - Message: ${details.message}
      - Timestamp: ${details.timestamp}
    `;


    await this._processSendEmail( process.env.ADMIN_MAIL,subject,body,body);
  }

  async _processSendEmail(to, subject, text, body): Promise<void> {
    try {
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
