import {
  EmailSenderProviderPort,
  SendEmailInput,
} from './email-sender.provider.port';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailSenderProvider implements EmailSenderProviderPort {
  private readonly client: Resend;
  private readonly logger = new Logger(EmailSenderProvider.name);

  constructor(private readonly configService: ConfigService) {
    this.client = new Resend(
      configService.getOrThrow<string>('RESEND_API_KEY'),
    );
  }

  async send({ to, subject, html }: SendEmailInput): Promise<void> {
    const { error } = await this.client.emails.send({
      from: this.configService.getOrThrow<string>('MAIL_FROM'),
      to,
      subject,
      html,
    });

    if (error)
      this.logger.error(
        `Error while sending email:\nName: ${error.name}\nMessage: ${error.message}\nStatus:${error.statusCode}`,
      );
  }
}
