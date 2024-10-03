import { Injectable } from '@nestjs/common';
import { MailerService as MailerMain } from '@nestjs-modules/mailer';
import { MailService } from './IMailService';
import { CreateEmailServerDto } from './Dto/createEmailServerDto';
import { accountCreationTemplate } from './templates/accountCreation';
@Injectable()
export class EmailServerService implements MailService {
  constructor(private readonly mailerMain: MailerMain) {}

  async sendMail(email: CreateEmailServerDto): Promise<void> {
    const renderedTemplate = this._bodyTemplate(email.userName);
    const plainText = `Hello ${email.userName}, your account was successfully created!`;

    // Send the email with the rendered HTML
    await this._processSendEmail(
      email.to,
      email.subject,
      plainText,
      renderedTemplate,
    );
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

  /**
   * Sends an email with the specified details.
   *
   * @param {string} to - The recipient of the email.
   * @param {string} subject - The subject of the email.
   * @param {string} text - The plain text content of the email.
   * @param {string} body - The HTML content of the email.
   * @return {Promise<void>} A promise that resolves when the email is sent successfully.
   */
  private async _processSendEmail(to, subject, text, body): Promise<void> {
    await this.mailerMain
      .sendMail({
        to: to,
        subject: subject,
        text: text,
        html: body,
      })
      .then(() => {
        console.log('Email sent');
      })
      .catch((e) => {
        console.log('Error sending email', e);
      });
  }
}
