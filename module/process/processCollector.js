const runPowershell = require('../powershell/runPowershell');
const pm = require('./processModel');
const PS1 = require('../powershell/powershellCommand');

module.exports = {
    beginProcessCollector: function(callback_u) {
        beginProcessCollector( function(callback) {
            callback_u(callback);
        })
    }
}

function checkComponentValue(component) {
    if(component == '' || component == null || component == undefined ) {
        return false;
    }
    return true;
}

var dbCallback = (event)=>{};

function beginProcessCollector(callback) {
    //var powershellCommand = "Get-Process | select handle, NPM, PM, WS, CPU, Id, Si, starttime, ProcessName | Format-Table";
    runPowershell.executePSCommand(PS1.PS1().getProcess, processProcessPSResult );
    dbCallback = callback;
}

function processProcessPSResult(result) {
    var processArray = result.split(/\r?\n/);
    var allProcess = [];
    var countIgnoreHeader = 0
    processArray.forEach((val) => {
        component = val.trim().split(/\s+/);
        if( checkComponentValue(component[0]) &&
            checkComponentValue(component[1]) &&
            checkComponentValue(component[2]) &&
            checkComponentValue(component[3]) &&
            checkComponentValue(component[4]) &&
            checkComponentValue(component[5]) &&
            checkComponentValue(component[6]) &&
            checkComponentValue(component[7]) &&
            checkComponentValue(component[10])) {
        if(countIgnoreHeader < 2) { 
            countIgnoreHeader+=1; 
            return;
        }
        allProcess.push(new pm.ProcessModel( {
            handles: component[0],
            NPM: component[1],
            PM: component[2],
            WS: component[3],
            CPU: component[4],
            id: component[5],
            SI: component[6],
            starttime: component[7] + ' ' + component[8] + ' ' + component[9],
            processName: component[10],
        }))
        }
    })
    // console.log(allProcess);
    // return allProcess;
    dbCallback(allProcess);
}

function beginProcessUsageCollector(callback) {
    
}