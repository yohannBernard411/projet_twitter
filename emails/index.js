const nodemailer = require('nodemailer');
const sparkPostTransporter = require('nodemailer-sparkpost-transport');
const path = require('path');
const pug = require('pug');
const env = require(`../environment/${ process.env.NODE_ENV }`);

class Email {
  constructor() {
    this.from = 'Yohann Project <contact@yohann-project.site>';
    if (process.env.NODE_ENV === "production") {
      console.log('api key a verifier: ', env.sparkPostApiKey);
      this.transporter = nodemailer.createTransport(sparkPostTransporter({
        sparkPostApiKey: env.sparkPostApiKey,
        endpoint: 'https://api.eu.sparkpost.com'
      }));
    }else {
      this.transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "1e2d7f68422685",
          pass: "72bfea979f235b"
        }
      });
    }
  }

  async sendEmailVerification(options) {
    try{
      const email = {
        from: this.from,
        subject: 'Email verification',
        to: options.to,
        html: pug.renderFile(path.join(__dirname, "templates/email-verification.pug"), {
          username: options.username,
          url: `https://${ options.host }/users/email-verification/${ options.userId }/${ options.token }`
        })
      };
      const response = await this.transporter.sendMail(email);
    }catch(e){
      throw e;
    }
  }

  async sendResetPasswordLink(options) {
    try{
      const email = {
        from: this.from,
        subject: 'Password reset',
        to: options.to,
        html: pug.renderFile(path.join(__dirname, "templates/password-reset.pug"), {
          url: `https://${ options.host }/users/reset-password/${ options.userId }/${ options.token }`
        })
      };
      const response = await this.transporter.sendMail(email);
      console.log(response);
    }catch(e){
      throw e;
    }
  }

}

module.exports = new Email();
