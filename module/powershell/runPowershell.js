const powershell = require('node-powershell');

module.exports = {
    executePSCommand: function(cmd, callback_u) {
        executePSCommand(cmd, function(callback) {
            callback_u(callback);
        })
    },
    executePSFile: function(filename, parameter, callback_u) {
        executePSFile(filename, parameter, function(callback) {
            callback_u(callback);
        })
    }
}

function executePSCommand(cmd, callback) {
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })
    ps.addCommand(cmd)
    ps.invoke()
    .then(output => {
        // console.log(output)
        callback(output)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })
} 

function executePSFile(filename, parameter, callback) {
    let ps = new powershell({
        executionPolicy: 'Bypass',
        noProfile: true
    })
    if(parameter === null)
        parameter = []

    ps.addCommand(filename, parameter)
    // ps.addCommand(filename).then(()=>ps.addParameters(parameter));

    ps.invoke()
    .then(output => {
        // console.log(output)
        callback(output)
    })
    .catch(err => {
        console.error(err)
        ps.dispose()
    })
}