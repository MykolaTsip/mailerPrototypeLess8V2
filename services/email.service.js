const mailer = require('nodemailer')
const EmailTemplates = require('email-templates')
const path = require('path')

const htmlTemplates = require('../email-templates')
const conf = require('../configs/configs')

console.log('мейлер, ти жививй????')

const emailTemplates = new EmailTemplates({
    message: null,
    views: {
        root: path.join(process.cwd(), 'email-templates')
    }
})

const transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: conf.ROOT_EMAIL,
        pass: conf.ROOT_EMAIL_PASSWORD
    }
})


class EmailService {
    async sendMail(userEmail, action, context) {
        try {

            const templateInfo = htmlTemplates[action]
            const html = emailTemplates.render(templateInfo.templateFileName, {...context, frontendUrl: 'https://www.youtube.com/watch?v=l9nh1l8ZIJQ'})

            const mailOptions = {
                from: 'NO REPLY CAR SHOP',
                to: userEmail,
                subject: templateInfo.subject,
                html
            }

            return  transporter.sendMail(mailOptions)
        }
        catch (e) {
            console.log('(((((((((((-------')
            console.log(e)
        }

    }
}


console.log('мейлер, ти точно живий?')

console.log('ну ти мейлер даєш')
module.exports = new EmailService()



