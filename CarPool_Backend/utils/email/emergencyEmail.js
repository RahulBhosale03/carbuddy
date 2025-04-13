const nodeMailer = require('nodemailer');
const dotenv = require('dotenv');
const { customError } = require('../../middlewares/errorhandler.middleware.js');

dotenv.config();

const senderEmail = process.env.SENDER_EMAIL_ID;
const senderPass = process.env.SENDER_EMAIL_PASS;

const sendEmail = async (receiver, subject, message) => {
    const transport = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderEmail,
            pass: senderPass
        }
    });

    const mailOptions = {
        from: `Car Buddy ${senderEmail}`,
        to: receiver,
        subject: subject,
        text: message
    };

    try {
        const result = await transport.sendMail(mailOptions);
        return result;
    } catch (error) {
        throw new customError(500, error.message || 'Error while sending email');
    }
};

module.exports = {sendEmail};
