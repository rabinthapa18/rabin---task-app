const nodemailer = require('nodemailer')
const { google } = require('googleapis')


// ======= accessing OAuth2 from google =======
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

const accessToken = oAuth2Client.getAccessToken()

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: 'rabinson.dev.18@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
    }
})


const sendWelcomeEmail = async (email, name) => {
    try {
        // const mailOptions = 

        await transport.sendMail({
            to: email,
            from: 'Task-app<rabinson.dev.18@gmail.com>',
            subject: 'Thankyou for joining in!',
            text: `Welcome ${name}, your account has been successfully created. Kindly let me know how you feel about this app and I hope you get along with the app.`
        })
    } catch (e) {
        console.log(e);
    }
}


const sendByeEmail = async (email, name) => {
    try {
        await transport.sendMail({
            to: email,
            from: 'Task-app<rabinson.dev.18@gmail.com>',
            subject: 'We are sad to see you go!',
            text: `Hello ${name}, your account has been sucessfully deleted. We are sad to see you go. Plese tell us how can we improve aur app. Hope to see you back sometime soon.`
        })
    } catch (e) {
        console.log(e);
    }
}


module.exports = {
    sendWelcomeEmail,
    sendByeEmail
}