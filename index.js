const express = require('express')
const app = express()

const MobileDetect = require('mobile-detect');

app.get('/', function (req, res) {
    res.send('Hello Home!');
});

app.get('/tracker', function (req, res) {
    md = new MobileDetect(req.headers['user-agent']);
    let browserType = "desktop";

    if (md.mobile()) {
        if (md.tablet()) browserType = "tablet";
        else browserType = "phone";
    }
    else if (md.match('playstation|xbox|nintendo')) browserType = "game console";
    else if (md.match('tv')) browserType = "smart tv";

    const params = {
        browser: browserType,
        params: req.query,
        remoteAddress: req.socket.remoteAddress,
        host: req.headers,
    }
    res.send(params);
});


app.listen(3000);