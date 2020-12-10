const sgMail = require('@sendgrid/mail');

const sendgridAPIKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendgridAPIKey);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yogeshkumar.05@live.in',
    subject: `Thanks for joining`,
    text: `Welcome to the app ${name}. Let me know how you get along with the app.`
  });
}


const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'yogeshkumar.05@live.in',
    subject: `Goodbye ${name}`,
    text: `We're sad to see you go.\n PLease let me knowis we could have done something better to have you on the app.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail
}