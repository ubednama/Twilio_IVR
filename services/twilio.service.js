const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const serverUrl = process.env.SERVER_URL;
const client = twilio(accountSid, authToken);

const initiateCall = (phoneNumber, message, interviewLink) => {

    const twimlUrl = `${serverUrl}/twiml?interviewLink=${encodeURIComponent(interviewLink)}&phoneNumber=${encodeURIComponent(phoneNumber)}`;

    return client.calls.create({
        url: twimlUrl,
        to: phoneNumber,
        from: twilioPhoneNumber,
        method: 'GET'
    });
};

const sendInterviewLink = (to, interviewLink) => {
    console.log('Sending interview link:', { to, interviewLink });
    return client.messages.create({
        body: `Thank you for your interest! Here is your personalized interview link: ${interviewLink}`,
        from: twilioPhoneNumber,
        to: to
    });
};

module.exports = {
    initiateCall,
    sendInterviewLink
};
