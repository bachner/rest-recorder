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
    const {query} = req;
    let keys = Object.keys(query);
    let filter = (param) => true;
    if (keys.length) {
        filter = (field) => jsonParse(field)[keys[0]] === query[keys[0]];
    }

    fs.readFile(dataFile, options, function (err, data) {
        if (err) throw err;
        let result = data.split('\n').filter(filter);
        res.send(`${result}`);
    });
});

function storeRequest(req, res) {
    const {baseUrl, path, route, query, params, originalUrl, hostname, ip, ips, cookies, body, headers} = req;
    const data = {baseUrl, path, route, query, params, originalUrl, hostname, ip, ips, cookies, body, headers};
    console.log(data);
    fs.appendFileSync(dataFile, JSON.stringify(data) + '\n', options);
    res.send(data);
}

app.post('*', (req, res) => {
    storeRequest(req, res);
});

app.get('*', (req, res) => {
    if (!req.originalUrl.startsWith('/data')) {
        storeRequest(req, res);
    }
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

function jsonParse(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}