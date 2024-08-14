using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace EmailSenderLibrary
{
    public class EmailSender
    {
        private readonly string _smtpServer;
        private readonly int _smtpPort;
        private readonly string _username;
        private readonly string _password;

        public EmailSender(string smtpServer, int smtpPort, string username, string password)
        {
            _smtpServer = smtpServer;
            _smtpPort = smtpPort;
            _username = username;
            _password = password;
        }

        public void SendEmail(string fromName, string fromEmail, string toName, string toEmail, string subject, string body)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(new MailboxAddress(toName, toEmail));
            message.Subject = subject;

            var bodyBuilder = new BodyBuilder { HtmlBody = body };
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.Connect(_smtpServer, _smtpPort, SecureSocketOptions.StartTls);
                client.Authenticate(_username, _password);

                client.Send(message);
                client.Disconnect(true);
            }
        }
    }
}
