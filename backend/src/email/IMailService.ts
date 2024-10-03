export interface MailService {
  /**
   * @description Send email
   */
  sendMail(content: NonNullable<unknown>): Promise<void>;

  /**
   * @description Send email sandbox
   */
  sendMailSandBox(content: NonNullable<unknown>): Promise<void>;
}
