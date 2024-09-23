using EmailSenderLibrary;

namespace Libraries.Test
{
    public class EmailSenderLibrary
    {
        private EmailSender _emailSender;

        [SetUp]
        public void Setup()
        {
            _emailSender = new EmailSender("smtp.mail.ru", 465, "", "");
        }

        [Test]
        public async Task SendEmailAsyncTest()
        {
            try
            {
                // Arrange
                var fromName = "Sender Name";
                var fromEmail = "spottymotor@mail.ru";
                var toName = "Recipient Name";
                var toEmail = "spottymotor@mail.ru";
                var subject = "Test Subject";
                var body = "Test Body";

                // Act
                await _emailSender.SendEmailAsync(fromName, fromEmail, toName, toEmail, subject, body);
                Assert.True(true);
            }
            catch
            {
                Assert.True(false);
            }
        }
    }
}