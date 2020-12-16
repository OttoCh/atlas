const { net } = require("sqlite3");

function Process(handles, NPM, PM, WS, CPU, id, SI, starttime, processName, processId, batchId) {
    this.handles = handles;
    this.NPM = NPM;
    this.PM = PM;
    this.WS = WS;
    this.CPU = CPU;
    this.id = id;
    this.SI = SI;
    this.starttime = starttime;
    this.processName = processName;
    this.processId = processId
    this.batchId = batchId
}

function SimpleProcess( id, processName, createdTime) {
    this.id = id;
    this.processName = processName;
    this.createdTime = createdTime;
}

function ProcessUsage(id, processId, batchId, name, CPU, memoryMb, memoryP, diskMb, network, logTime) {
    this.id = id;
    this.processId = processId;
    this.batchId = batchId;
    this.name = name;
    this.CPU = CPU;
    this.memoryMb = memoryMb;
    this.memoryP = memoryP;
    this.diskMb = diskMb;
    this.network = network;
    this.logTime = logTime;
}

module.exports.ProcessModel = function ( {handles=0, NPM=0, PM=0, WS=0, CPU=0, id=0, SI=0, starttime=0, processName='none', processId=0, batchId=0} = {} ) {
    return new Process(handles, NPM, PM, WS, CPU, id, SI, starttime, processName, processId, batchId);
}

module.exports.SimpleProcessModel = function ( {id=0, ProcessName='', CreatedTime=''} = {}) {
    return new SimpleProcess(id, ProcessName, CreatedTime);
}

module.exports.ProcessUsage = function({id=0, processId=0, batchId=0, name='', CPU='', memoryMb='', memoryP='', diskMb='', network='', logTime=Date().toLocaleString()} = {}) {
    return new ProcessUsage(id, processId, batchId, name, CPU, memoryMb, memoryP, diskMb, network, logTime);
}