const express = require('express');
const router = express.Router();
const twilioService = require('../services/twilio.service');
const VoiceResponse = require('twilio').twiml.VoiceResponse;

router.post('/initiate-call', (req, res) => {

    const { phoneNumber, message, interviewLink } = req.body;

    twilioService.initiateCall(phoneNumber, message, interviewLink)
        .then(callSid => {
            res.send(`Call initiated to ${callSid.to} from ${callSid.from}`);
        })
        .catch(err => {
            console.error('Error initiating call:', err);
            res.status(500).send(`Error initiating call: ${err.message}`);
        });
});

router.post('/handle-response', (req, res) => {

    try {
        const Digits = req.body.Digits;
        const interviewLink = req.query.interviewLink;
        const phoneNumber = req.query.phoneNumber;

        if (Digits === '1') {
            twilioService.sendInterviewLink(phoneNumber, interviewLink)
                .then(messageSid => {
                    res.type('text/xml');
                    res.send(`
                        <Response>
                            <Say>Thank you for your interest. We've sent the interview link to your phone.</Say>
                        </Response>
                    `);
                })
                .catch(err => {
                    res.type('text/xml');
                    res.send(`
                        <Response>
                            <Say>We're sorry, but there was an error sending the interview link. Please try again later.</Say>
                        </Response>
                    `);
                });
        } else {
            res.type('text/xml');
            res.send(`
                <Response>
                    <Say>Thank you for your response. Have a great day!</Say>
                </Response>
            `);
        }
    } catch (error) {
        res.type('text/xml');
        res.send(`
            <Response>
                <Say>We're sorry, but an error occurred. Please try again later.</Say>
            </Response>
        `);
    }
});

router.get('/twiml', (req, res) => {

    const interviewLink = req.query.interviewLink;
    const phoneNumber = req.query.phoneNumber;

    const response = new VoiceResponse();
    const gather = response.gather({
        input: 'dtmf',
        action: `/handle-response?interviewLink=${encodeURIComponent(interviewLink)}&phoneNumber=${encodeURIComponent(phoneNumber)}`,
        method: 'POST',
    });
    gather.play('https://dandelion-hamster-9102.twil.io/assets/Fara-interview-audio.mp3');

    res.type('text/xml');
    res.send(response.toString());
});


module.exports = router;