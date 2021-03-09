const app = require('express')();
const exec = require('child_process').exec;
const fs = require('fs');

const { port, updateFrequencyMs, scripts } = require('./config');

let logger = fs.createWriteStream("mylog");

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
  });

  let timenow = new Date().toLocaleString();
  res.send(html+"<hr><small>Last Updated: "+timenow+"</small> | <a href=\"status.json\">JSON</a>");
  let logmsg = timenow+" "+ip+" GET / "+", replied: "+html+"\n";
  process.stdout.write(logmsg);
  logger.write(logmsg);
});

app.get('/status.json', (req, res) => {
  res.json(scripts);
});

function updateFields() {
  scripts.forEach(script=>{
    exec(script.cmd, (err, stdout, stderr)=>{
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

