var amqp = require('amqplib');
var fs = require("fs");
var cdlib = require('../cd_lib');
var serialize = require('node-serialize');
//var email = require('emailjs');
var Promise =  require('bluebird');

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
            console.log("promise sendEmail true");
            //console.log(status);
              ch.ack(msg);
          }).catch(function (status) {
            console.log("promise sendEmail false");
            ch.nack(msg);
            console.log(status);
          })
          } else {
               emailServer.sendText(emailServer.body)
            .then(function (status) {
            console.log("promise sendEmail true");
            //console.log(status);
              ch.ack(msg);
          }).catch(function (status) {
            console.log("promise sendEmail false");
            ch.nack(msg);
            console.log(status);
          })
          }




         /**
          if (emailServer.sendEmail()) {
              ch.ack(msg);
          } else {
              ch.nack(msg);
          }
          **/
      }, {noAck: false});
    });

    return ok.then(function(_consumeOk) {
      console.log(' [*] Waiting for messages. To exit press CTRL+C');
    });
  });
}).then(null, console.warn);
