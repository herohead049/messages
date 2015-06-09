var email = require('emailjs');

var server = email.server.connect({ host: "smtp.mt.com"});

server.send({
   text:    "i hope this works",
   from:    "craig.david@mt.com",
   to:      "craig.david@mt.com",
   cc:      "",
   subject: "testing emailjs"
}, function(err, message) { console.log(err || message); });
