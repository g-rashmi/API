const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: subject,
            text: text,
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.log('Email not sent');
        console.log(error);
    }
};

module.exports = sendEmail;
