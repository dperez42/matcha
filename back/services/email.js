//https://naji0329.medium.com/4-javascript-email-frameworks-nodemailer-sendgrid-smtp-js-and-mailgun-8142fe73e7d1
//https://enlear.academy/8-best-javascript-email-api-libraries-9749bd524ea2
//https://es.stackoverflow.com/questions/539336/desactivaci%C3%B3n-de-aplicaciones-menos-seguras-de-google
//https://www.freecodecamp.org/espanol/news/como-usar-nodemailer-para-enviar-correos-electronicos-desde-tu-servidor-node-js/


const nodemailer = require('nodemailer');

// template function not use
async function send(email, key) {
  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: "smtp-relay.sendinblue.com",
    port: process.env.PORT_BREVO,
    auth: {
      //type: 'OAuth2',
      //user: 'dpzafra70@gmail.com',
      //pass: 'xxxxxxxxxxxx',
      // clientId: process.env.OAUTH_CLIENTID,
      // clientSecret: process.env.OAUTH_CLIENT_SECRET,
      // refreshToken: process.env.OAUTH_REFRESH_TOKEN
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_KEY_BREVO,

    }
  });

  let mailOptions = {
    from: 'matcha@matcha.com', 
    to: [email],
    subject: 'Matcha Verification email',
    text: "<!DOCTYPE html> <html> <body> <h1>Confirm your email</h1> <p>Please confirm your email address by clicking on the link below: </p><p>http://localhost:3000/verification/"+key+"/p></body> </html>",
  };
  //console.log("Creating Email");
  try {
    const result = await transporter.sendMail(mailOptions)
    //console.log("Email sent successfully");
    //console.log(result)
    return result
  }
  catch (err) {
    //console.log("Email NOT sent");
    console.log(err.code);  // EAUTH = no autorizado
    return err
  } 
}
// send email to reset password
async function sendReset(email, key) {
  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: "smtp-relay.brevo.com",
    port: process.env.PORT_BREVO,
    auth: {
      //type: 'OAuth2',
      //user: 'dpzafra70@gmail.com',
      //pass: 'xxxxxxxxxxxx',
      // clientId: process.env.OAUTH_CLIENTID,
      // clientSecret: process.env.OAUTH_CLIENT_SECRET,
      // refreshToken: process.env.OAUTH_REFRESH_TOKEN
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_KEY_BREVO,

    }
  });

  let mailOptions = {
    from: 'matcha@matcha.com', 
    to: [email],
    subject: 'Matcha Reset password',
    text: "<!DOCTYPE html> <html> <body> <h1>Reset your password</h1> <p>Please click in the link below to reset your password: </p><p>"+process.env.URL_APP+"/reset?matcha_token="+key+"</p></body> </html>",
  };
  try {
    const result = await transporter.sendMail(mailOptions)
    if (process.env.DEBUG==='true'){console.log("Info: Email Reset sent successfully. " + result)};
    return result
  }
  catch (err) {
    if (process.env.DEBUG==='true'){console.log("Error: Email Reset NOT sent successfully. " + err)}; // EAUTH = no autorizado
    return err
  } 
}
// send email with code
async function sendCode(email, username, code) {
  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: "smtp-relay.brevo.com",
    port: process.env.PORT_BREVO,
    auth: {
      //type: 'OAuth2',
      //user: 'dpzafra70@gmail.com',
      //pass: 'xxxxxxxxxxxx',
      // clientId: process.env.OAUTH_CLIENTID,
      // clientSecret: process.env.OAUTH_CLIENT_SECRET,
      // refreshToken: process.env.OAUTH_REFRESH_TOKEN
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_KEY_BREVO,

    }
  });
  let mailOptions = {
    from: 'matcha@matcha.com', 
    to: [email],
    subject: 'Matcha Verification email (code)',
    text: "<!DOCTYPE html> <html> <body> <h1> Hello "+username+", Verificate your email</h1> <p>Please confirm your email address by insert this code: </p><H3>"+code+"</H3></body> </html>",
  };
  console.log("Creating Email");
  try {
    const result = await transporter.sendMail(mailOptions)
    if (process.env.DEBUG==='true'){console.log("Info: Email code sent successfully. " + result)};
    return result
  }
  catch (err) {
    if (process.env.DEBUG==='true'){console.log("Error: Email code NOT sent successfully. " + err)}; // EAUTH = no autorizado
    return err
  } 
}
// send email with link+token with data user+socket to verify 
async function sendLink(email, username, token) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: "smtp-relay.brevo.com",
    port: process.env.PORT_BREVO,
    auth: {
      //type: 'OAuth2',
      //user: 'dpzafra70@gmail.com',
      //pass: 'xxxxxxxxxxxx',
      // clientId: process.env.OAUTH_CLIENTID,
      // clientSecret: process.env.OAUTH_CLIENT_SECRET,
      // refreshToken: process.env.OAUTH_REFRESH_TOKEN
      user: process.env.EMAIL_USER,
      pass: process.env.SMTP_KEY_BREVO,
    }
  });
  // send mail with defined transport object
  let mailOptions = {
    from: 'matcha@matcha.com', 
    to: [email],
    subject: 'Matcha Verification email',
    text: "<!DOCTYPE html> <html> <body> <h1>Hello "+username+", verificate your email</h1> <p>Please confirm your email address by clicking on the link below, expires in "+process.env.JWT_TOKEN_EXPIRES+" : </p><p>"+process.env.URL_BACK+"/verifyclick?token="+token+"</p></body> </html>",
  };
  try {
    const result = await transporter.sendMail(mailOptions)
    if (process.env.DEBUG==='true'){console.log("Info: Email Link sent successfully. " + result)};
    return result
  }
  catch (err) {
    if (process.env.DEBUG==='true'){console.log("Error: Email Link NOT sent successfully. " + err)}; // EAUTH = no autorizado
    return err
  } 
}
module.exports = {
   send,
   sendReset,
   sendCode,
   sendLink

}