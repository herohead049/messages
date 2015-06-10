var amqp = require('amqplib');
var fs = require("fs");
var cdlib = require('cdlib');
var serialize = require('node-serialize');
var Promise =  require('bluebird');
var colors = require('colors');

var rabbitMQ = {
    'server': cdlib.getRabbitMQAddress(),
    'username': 'test',
    'password': 'test',
    'virtualHost': '/test',
    'queue': 'notifications.email'
}

var rabbitMQAuthString = 'amqp://' + rabbitMQ.username + ':' + rabbitMQ.password + '@' + rabbitMQ.server + rabbitMQ.virtualHost;

amqp.connect(rabbitMQAuthString).then(function(conn) {
  process.once('SIGINT', function() { conn.close(); });
  return conn.createChannel().then(function(ch) {

    var ok = ch.assertQueue(rabbitMQ.queue, {durable: true});

    ok = ok.then(function(_qok) {
      return ch.consume(rabbitMQ.queue, function(msg) {
          var emailServer = serialize.unserialize(msg.content.toString());
          if (emailServer.type === 'html') {
            emailServer.sendHtml(emailServer.htmlData)
            .then(function (status) {
            console.log("Email Sent".green);

            //console.log(status);
              ch.ack(msg);
          }).catch(function (status) {
            console.log("promise sendEmail false");
            console.log("promise sendEmail true".red);
            console.log("Email to " + emailServer.to.red);
            console.log("Subject " + emailServer.subject.red);
            ch.nack(msg);
            console.log(status);
          })
          } else {
               emailServer.sendText(emailServer.body)
            .then(function (status) {
            console.log("promise sendEmail true".green);
            console.log("Email to " + emailServer.to.green);
            console.log("Subject " + emailServer.subject.green);
            //console.log(status);
              ch.ack(msg);
          }).catch(function (status) {
            console.log("promise sendEmail false".red);
            ch.nack(msg);
            console.log(status);
          })
          }
      }, {noAck: false});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C'.green);
    });
  });
}).then(null, console.warn);
