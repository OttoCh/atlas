function QueryList() {
    this.selectAllMstProcessQry = "SELECT ID, ProcessName, CreatedTime FROM MST_PROCESS";
    this.selectAllMstServiceQry = "SELECT ID, ServiceName, CreatedTime FROM MST_SERVICE";
    this.selectAllProcessLogQry = "SELECT ID, ProcessId, BatchId, Handle, NPM, PM, WS, CPU, PID, SI, StartTime, LogTime FROM PROCESS_LOG";
    this.selectAllServiceLogQry = "SELECT ID, ServiceId, BatchId, Status, LogTime FROM SERVICE_LOG";
    this.selectAllCollectionBatchQry = "SELECT ID, BatchTime, Status, Description FROM COLLECTION_BATCH";
    this.selectLastCollectionBatchIdQry = "SELECT MAX(ID) ID FROM COLLECTION_BATCH";

    this.insertMstProcessQry = "INSERT INTO MST_PROCESS(ProcessName, CreatedTime) VALUES(?, ?)";
    this.insertMstServiceQry = "INSERT INTO MST_SERVICE(ServiceName, CreatedTime) VALUES(?, ?)";
    this.insertProcessLogQry = "INSERT INTO PROCESS_LOG(ProcessId, BatchId, Handle, NPM, PM, WS, CPU, PID, SI, StartTime, LogTime) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    this.insertServiceLogQry = "INSERT INTO SERVICE_LOG(ServiceId, BatchId, Status, LogTime) VALUES(?,?,?,?)";
    this.insertCollectionBatchQry = "INSERT INTO COLLECTION_BATCH(Status, Description) VALUES(?, ?)";
}

module.exports.Q = function() {
    return new QueryList();
}