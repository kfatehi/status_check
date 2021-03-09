const app = require('express')();
const exec = require('child_process').exec;
const fs = require('fs');

const { port, updateFrequencyMs, scripts } = require('./config');

const slowDown = require("express-slow-down");

app.enable("trust proxy"); // only if you're behind a reverse proxy (Caddy, Heroku, Bluemix, AWS if you use an ELB, custom Nginx setup, etc)

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 4, // allow 100 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});

//  apply to all requests
app.use(speedLimiter);

let field = "Loading";
app.get('/', (req, res) => {
  let html = "";
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  scripts.forEach(script=>{
    if (script.code == script.shouldBe) {
      html+="<p style=\"color:green\">"+script.successText+"</p>"
    } else {
      html+="<p style=\"color:red\">"+script.failText+"</p>"
    }
    html+="<small>Last Updated: "+script.time+"</small>"
  });
  res.send(html+"<hr> <p><a href=\"status.json\">api</a> | <a href=\"https://github.com/kfatehi/status_check\">source code</a> <p>");
});

app.get('/status.json', (req, res) => {
  res.json(scripts);
});

function updateFields() {
  scripts.forEach(script=>{
    exec(script.cmd, (err, stdout, stderr)=>{
      script.time = new Date().toLocaleString();
      script.code = 1;
      script.stderr = stderr;
      if (err) {
        script.error = err.message;
        return;
      }
      script.code = 0;
      script.stdout = stdout;
    });

  })
}

setInterval(()=>{
  updateFields();
}, updateFrequencyMs);
updateFields();

app.listen(port, ()=>{
  console.log('listening');
});

