'use strict';

const express = require('express');
const fs = require('fs');

// Constants
const PORT = 6060;
const HOST = '0.0.0.0';
const dataFile = 'data.txt';
const options = 'utf8';

// App
const app = express();
app.get('/data', (req, res) => {

    fs.readFile(dataFile, options, function (err, data) {
        if (err) throw err;
        res.send(`${data}`);
    });
});

app.get('*', (req, res) => {
    const {baseUrl, path, route, query, params, originalUrl, hostname, ip, ips, cookies, body, headers} = req;
    const data = {baseUrl, path, route, query, params, originalUrl, hostname, ip, ips, cookies, body, headers};
    console.log(data);
    fs.appendFileSync(dataFile, JSON.stringify(data), options);
    res.send(data);
});

initDataFile();

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

function initDataFile() {
    fs.exists(dataFile, (exists) => {
        if (exists) {
            console.log(`file: ${dataFile} exists, appending data to file`);
        }
        else {
            fs.writeFileSync(dataFile, '', options);
        }
    });
}