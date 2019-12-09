export default {
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  default: {
    from: 'Equipe GoBarber <noreply@gobarber.com>',
  },
};

/**
 * Serviços de Envio de e-mail
 * -> Amazon SES
 * Mailgun
 * Sparkpost
 * Mandril (mailchimp)
 * gmail
 * Mailtrap (para ambiente de desenvolvimento)
 */
