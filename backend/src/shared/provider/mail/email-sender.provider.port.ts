export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export interface EmailSenderProviderPort {
  send({ to, subject, html }: SendEmailInput): Promise<void>;
}

export const EmailSenderProviderPort = Symbol('EmailSenderProviderPort');
