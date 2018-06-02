var xml2js = require('xml2js');
var json2xml = require('json2xml');
var jsonlint = require('jsonlint');

function xmlToJson(text, callback) {
    xml2js.parseString(text, function (err, result) {
        if (err) {
            callback(err);
            return;
        }

        callback(null, JSON.stringify(result));
    });
}

function xmlToXml(text, callback) {
    callback(null, text);
}

function jsonToJson(text, callback) {
    try {
        jsonlint.parse(text);
        callback(null, JSON.stringify(JSON.parse(text)));
    } catch (e) {
        callback(e);
    }
}

function jsonToXml(text, callback) {
    try {
        jsonlint.parse(text);
        callback(null, json2xml(JSON.parse(text)));
    } catch (e) {
        callback(e);
    }
}

function jsonToPhp(text, callback) {
    var textTo = JSON.stringify(JSON.parse(text), null, 2);
    // replace the {} that stand alone
    textTo = textTo.replace(/(^|\n\s*){}/, '$1[]');
    // replace {} in: "key": {}
    textTo = textTo.replace(/(\n\s*"[^"]*":\s){}/g, '$1[]');
    // replace { that stand alone
    textTo = textTo.replace(/(^|\n\s*){/g, '$1[');
    // replace { in "key": {
    textTo = textTo.replace(/(\n\s*"[^"]*":\s){/g, '$1[');
    // replace } that stand a lone
    textTo = textTo.replace(/(\n\s*)}/g, '$1]');
    // replace : to =>
    textTo = textTo.replace(/(\n\s*"[^"]*"):/g, '$1 =>');

    callback(null, textTo);
}

module.exports = function (text, from, to, callback) {
    switch (from) {
        case 'json':
            switch (to) {
                case 'json':
                    jsonToJson(text, callback);
                    return;
                case 'xml':
                    jsonToXml(text, callback);
                    return;
                case 'php':
                    jsonToPhp(text, callback);
                    return;
            }
            return;
        case 'xml':
            switch (to) {
                case 'json':
                    xmlToJson(text, callback);
                    return;
                case 'xml':
                    xmlToXml(text, callback);
                    return;
            }
            return;
    }

    return callback(null, text);
};