const { stat } = require("fs");

function Service(status, name, displayName) {
    this.status = status;
    this.name = name;
    this.displayName = displayName; 
}

function SimpleService(id, serviceName, createdTime) {
    this.id = id;
    this.serviceName = serviceName;
    this.createdTime = createdTime;
}

module.exports.ServiceModel = function({status='', name='', displayName=''} = {}) {
    return new Service(status, name, displayName);
}

module.exports.SimpleServiceModel = function({id=0, serviceName='', createdTime=''} = {}) {
    return new SimpleService(id, serviceName, createdTime);
}