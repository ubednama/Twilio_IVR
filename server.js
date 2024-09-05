const express = require('express');
const bodyParser = require('body-parser');
const twilioRoutes = require('./routes/twilio.routes');

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', twilioRoutes);

app.get("/api", (req, res) => {
    res.send("API is Live");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
