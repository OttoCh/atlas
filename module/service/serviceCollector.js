const runPowershell = require('../powershell/runPowershell');
const sm = require('./serviceModel');

module.exports = {
    beginServiceCollector: function(callback_u) {
        beginServiceCollector( function(callback) {
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

function beginServiceCollector(callback) {
    runPowershell.executePSCommand("Get-Service", processServicesPSResult);
    // callback();
}

function processServicesPSResult(result, callback) {
    var serviceArray = result.split(/\r?\n/);
    var countIgnoreHeader = 0
    var allServices = [];
    serviceArray.forEach((val) => {
        component = val.trim().split(/\s{2,}/);
        if( checkComponentValue(component[0]) && 
            checkComponentValue(component[1]) && 
            checkComponentValue(component[2])) {    
            if(countIgnoreHeader < 2) { 
                countIgnoreHeader+=1; 
                return;
            }
            allServices.push(new sm.ServiceModel(
                {
                    status: component[0],
                    name: component[1],
                    displayName: component[2]
                }
            ));
        }
        
    })
    console.log(allServices)
}