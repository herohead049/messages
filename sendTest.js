var fs = require("fs");
var cdlib = require('cd_lib');


cdlib.msgEmail.type = "html";


function sendHtml(file) {
    'use strict';

    fs.readFile(file,  function (err, data) {
        if (err) {
            return console.log(err);
        }
        cdlib.msgEmail.smtpServer = 'localhost'
        cdlib.msgEmail.htmlData = data;
        cdlib.msgEmail.subject = "Test";
        cdlib.msgEmail.to = "craig.david@mt.com";
        cdlib.msgEmail.sendToRabbit();
    });
}

function sendHtmlText(test) {
    'use strict';


        cdlib.msgEmail.smtpServer = 'localhost'
        cdlib.msgEmail.htmlData = test;
        cdlib.msgEmail.subject = "Test";
        cdlib.msgEmail.to = "craig.david@mt.com";
        cdlib.msgEmail.sendToRabbit();

}



//sendHtml('2015_06_03_AM_BackupReport_7days - Copy.html');
sendHtmlText('<b>Bold</b>');
