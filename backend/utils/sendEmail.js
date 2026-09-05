const nodemailer = require('nodemailer')

module.exports = async (userEmail, subject, htmlTemplate) => {
    try {
        const transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          family: 4, // <-- forces IPv4, avoids the IPv6 ENETUNREACH issue
          auth: {
            user: process.env.APP_EMAIL_ADDRESS,
            pass: process.env.APP_EMAIL_PASSWORD,
          },
        });

        const mailOptions = {
          from: process.env.APP_EMAIL_ADDRESS,
          to: userEmail,
          subject: subject,
          html: htmlTemplate,
        };
        
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent' + info.response)


    } catch (error) {
        console.log(error)
        throw new Error('Internal server eror (nodemailer)')
    }
}