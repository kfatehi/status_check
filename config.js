module.exports = {
  updateFrequencyMs: 5000,
  port: 4000,
  scripts: [{
    cmd: "netstat -ntlp | grep 1666",
    code: null,
    stderr: "",
    stdout: "",
    note: "if this is 0, then it means perforce is listening on port 1666 (everything is fine).",
    shouldBe: 0,
    successText: "perforce service is listening with ssl on tcp port 1666",
    failText: "perforce server is not listening. please contact support"
  }]
}
    //  cmd: "netstat -ntlp | grep 1888",
    //  code: null,
    //  stderr: "",
    //  stdout: "",
    //  note: "this should be 1, indicating that there is no service on port 1888 (which is correct, just an example to test failure)",
    //  shouldBe: 1,
    //  successText: "OK",
    //  failText: "NOT_OK"
