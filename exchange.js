var simplesmtp = require("simplesmtp"),
    fs = require("fs");

var smtp = simplesmtp.createServer();
smtp.listen(25);

smtp.on("startData", function(connection){
    console.log("Message from:", connection.from);
    console.log("Message to:", connection.to);
    console.log("Connection:", connection);
    connection.saveStream = fs.createWriteStream("message.txt");
});

smtp.on("data", function(connection, chunk){
    connection.saveStream.write(chunk);
});

smtp.on("dataReady", function(connection, callback){
    connection.saveStream.end(function () {
    //console.log(connection);
    console.log("Incoming message saved to message.txt");
    fs.readFile('message.txt',  function (err, data) {
        if (err) {
            return console.log(err);
        }
            mailparser.write(data);
            mailparser.end();
    });
    });



    callback(null, "ABC1"); // ABC1 is the queue id to be advertised to the client
    // callback(new Error("Rejected as spam!")); // reported back to the client
});



var MailParser = require("mailparser").MailParser,
    mailparser = new MailParser({showAttachmentLinks: true});

var email = "From: 'Sender Name' <sender@example.com>\r\n"+
            "To: 'Receiver Name' <receiver@example.com>\r\n"+
            "Subject: Hello world!\r\n"+
            "\r\n"+
            "How are you today?";
    // setup an event listener when the parsing finishes


mailparser.on("attachment", function(attachment, mail){
    var output = fs.createWriteStream(attachment.generatedFileName);
    attachment.stream.pipe(output);
    console.log(output);
});

mailparser.on("end", function(mail_object){
    console.log("From:", mail_object.from); //[{address:'sender@example.com',name:'Sender Name'}]
    console.log("Subject:", mail_object.subject); // Hello world!
    console.log("Text body:", mail_object.text); // How are you today?
     console.log("HTML Body:", mail_object.html);
});




