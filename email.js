var fs = require("fs");
var cdlib = require('../cd_lib/cd_lib');


cdlib.msgEmail.type = "html";


function sendHtml(file) {
    'use strict';

    fs.readFile(file,  function (err, data) {
        if (err) {
            return console.log(err);
        }
        cdlib.msgEmail.htmlData = data;
        cdlib.msgEmail.subject = process.argv[2];
        cdlib.msgEmail.to = "craig.david@mt.com";
        cdlib.msgEmail.sendToRabbit();
    });
}

sendHtml(process.argv[2]);

