import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EmailServerService } from '../email/email.service';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter implements ExceptionFilter {
  constructor(private readonly emailService: EmailServerService) {}

  async catch(exception: InternalServerErrorException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus ? exception.getStatus() : 500;

    console.error('Internal server error:', exception.message);
    try {
      await this.emailService.sendInternalServerErrorNotification({
        message: exception.message,
        url: request.url,
        method: request.method,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to send error notification email:', error.message);
      throw new InternalServerErrorException(error.message);
    }
    // Send email using your email service

    // Send the response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
