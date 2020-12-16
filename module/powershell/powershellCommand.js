const app = require('electron')

function PowershellCommand() {
    this.getProcess = "Get-Process | select handle, NPM, PM, WS, CPU, Id, Si, starttime, ProcessName | Format-Table";
    this.getServices = "Get-Services";
    this.getProcessUsageFile = app.getAppPath +  "/module/powershell/getProcessUsage.ps1";
}

module.exports.PS1 = function() {
    return new PowershellCommand();
}