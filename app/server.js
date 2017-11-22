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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/data', (req, res) => {
    const {query} = req;
    const  keys = Object.keys(query);
    let filter = (param) => param.length;
    if (keys.length) {
        filter = (field) => keys.every(key => jsonParse(field)[key] === query[key]);
    }

    fs.readFile(dataFile, options, function (err, data) {
        if (err) throw err;
        const result = data.split('\n').filter(filter);
        res.send(result);
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