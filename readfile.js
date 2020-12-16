const fs = require('fs')

module.exports = {
    openFile: function(filename, callback_u) {
        openFile(filename, function(callback) {
            callback_u(callback);
        })
    }
}

function openFile(filename, callback) {
    if(filename == undefined) {
        console.log("No file selected");
        return;
    }

    fs.readFile(filename, 'utf-8', (err, data) => {
        if(err) {
            alert("an error occured reading the file :" + err.message);
            return;
        }
        callback(data);
    })
}
