import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService as MailerMain } from '@nestjs-modules/mailer';
import { MailService } from './IMailService';
import { CreateEmailServerDto } from './Dto/createEmailServerDto';
import { accountCreationTemplate } from './templates/accountCreation';
import { CustomLogger } from '../Logger/CustomLogger.service';
import { ConfirmationEmailDto } from './Dto/ConfirmationEmailDto';
import { confirmationEmailTemplateEnglish } from './templates/confirmationMail/English';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { resetPassword } from './templates/resetPassword';
import { ResetPasswordEmailDto } from './Dto/resetPasswordEmailDto';
import { confirmationEmailTemplateFrench } from './templates/confirmationMail/French';
import { confirmationEmailTemplateSpanish } from "./templates/confirmationMail/Spanish";
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
  private _confirmMailTemplate(
    url: string,
    name: string,
    language: string,
  ): string {
    if (language === 'en') {
      return confirmationEmailTemplateEnglish({
        url: url,
        name: name,
      });
    }
    if (language === 'fr') {
      return confirmationEmailTemplateFrench({
        url: url,
        name: name,
      });
    }
    if (language === 'es') {
      return confirmationEmailTemplateSpanish({
        url: url,
        name: name,
      });
    }
  }

  private _passwordResetTemplate(url: string, name: string): string {
    // Use the template function to generate the HTML content
    return resetPassword({
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
    if (!Boolean(process.env.SMTP_DOMAIN)) {
      return;
    }
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
      if (!Boolean(process.env.SMTP_DOMAIN)) {
        return;
      }
      const token = this.jwtService.sign(
        { email: email.to },
        {
          secret: process.env.JWT_EMAIL_VERIFICATION_TOKEN_SECRET,
          expiresIn: '2100s',
        },
      );

      const url = `${process.env.FRONTEND_URL}/token/${token}`;

      const renderedTemplate = this._confirmMailTemplate(
        url,
        email.userName,
        email.language,
      );
      const plainText = `Welcome to ${process.env.INSTANCE_NAME}. To confirm the email address, click here: ${url}`;
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
      await this.mailerMain.sendMail({
        to: to,
        subject: `[${process.env.INSTANCE_NAME}] ${subject}`,
        text: text,
        html: body,
      });
      console.log('Email sent');
    } catch (error) {
      console.log('Error sending email', error);
      throw new InternalServerErrorException('Failed to send email', error);
    }
  }

  async sendResetPasswordLink(email: ResetPasswordEmailDto): Promise<void> {
    const url = `${process.env.FRONTEND_URL}/reset-password/${email.token}`;

    const renderedTemplate = this._passwordResetTemplate(url, email.userName);
    const plainText = `Hi, \\nTo reset your password, click here: ${url}`;

    return this._processSendEmail(
      email.to,
      'Reset password',
      plainText,
      renderedTemplate,
    );
  }
}
