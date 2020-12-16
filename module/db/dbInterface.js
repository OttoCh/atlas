'use strict'

const path = require('path')
const fs = require('fs')
const SQL = require('sqlite3')

const dbfilepath = path.join(__dirname, "../../control/atlasdb.sqlite");
const pm = require('../process/processModel');
const Query = require('./dbQuery');

/*
  SQL.js returns a compact object listing the columns separately from the
  values or rows of data. This function joins the column names and
  values into a single objects and collects these together by row id.
  {
    0: {first_name: "Jango", last_name: "Reinhardt", person_id: 1},
    1: {first_name: "Svend", last_name: "Asmussen", person_id: 2},
  }
  This format makes updating the markup easy when the DOM input id attribute
  is the same as the column name. See view.showPeople() for an example.
*/
let _rowsFromSqlDataObject = function (object) {
  let data = {}
  let i = 0
  let j = 0
  for (let valueArray of object.values) {
    data[i] = {}
    j = 0
    for (let column of object.columns) {
      Object.assign(data[i], {[column]: valueArray[j]})
      j++
    }
    i++
  }
  return data
}

/*
  Return a string of placeholders for use in a prepared statement.
*/
let _placeHoldersString = function (length) {
  let places = ''
  for (let i = 1; i <= length; i++) {
    places += '?, '
  }
  return /(.*),/.exec(places)[1]
}


  SQL.dbOpen = function () {
    try {
      console.log(dbfilepath);
      return new SQL.Database(dbfilepath);
    } catch (error) {
      console.log("Can't open database file.", error.message)
      return null
    }
  }
  
  SQL.dbClose = function (databaseHandle) {
    try {
      let data = databaseHandle.export()
      let buffer = Buffer.alloc(data.length, data)
      fs.writeFileSync(dbfilepath, buffer)
      databaseHandle.close()
      return true
    } catch (error) {
      console.log("Can't close database file.", error)
      return null
    }
  }
  
  /*
    A function to create a new SQLite3 database from schema.sql.
  
    This function is called from main.js during initialization and that's why
    it's passed appPath. The rest of the model operates from renderer and uses
    window.model.db.
  */

  function findAllProcess(callback) {
    let db = SQL.dbOpen();
    if(db == null) return;
    var allProcess = []
    db.all(Query.Q().selectAllMstProcessQry, [], (err, rows) => {
      if(err) {
        throw err;
      }
      rows.forEach((row) => {
        var aProcess = pm.SimpleProcessModel({
          id: row.ID,
          ProcessName: row.ProcessName,
          CreatedTime: row.CreatedTime,
        })
        allProcess.push(aProcess);
      })
      // console.log(allProcess);
      db.close();
      callback(allProcess);
    })
  }

  function getLastBatchId(callback) {
    let db = SQL.dbOpen();
    if(db == null) return;
    db.all(Query.Q().selectLastCollectionBatchIdQry, (err, row) => {
      console.log(row)
      db.close();
      callback(row[0].ID);
    })
    // let statement = db.prepare(Query.Q().selectLastCollectionBatchIdQry)
    // statement.run()
    // try {
    //   if (statement.finalize()) {
    //     let values = [statement.get()]
    //     let columns = statement.getColumnNames()
    //     return _rowsFromSqlDataObject({values: values, columns: columns})
    //   } else {
    //     console.log('model.getLoginQuestion', 'No question found')
    //   }
    // } catch (error) {
    //   console.log('model.getLoginQuestion', error.message)
    // } finally {
    //   db.close()
    // }
  }

  function insertCollectionBatchTbl(callback) {
    let db = SQL.dbOpen();
    if(db == null) return;

    let query = Query.Q().insertCollectionBatchQry;
    let statement = db.prepare(query)
    statement.run('', '')
    try {
      if (statement.finalize()) {
        console.log("Execute insert to COLLECTION_BATCH")
      } else {
        console.log("Failed to execute insert to COLLECTION_BATCH")
      }
      } catch (error) {
        console.log("Error: {}", error.message)
      } finally {
        db.close();
    }
    callback();
  }

  function insertSimpleProcessTbl(simpleProcessList, callback) {
    let db = SQL.dbOpen();
    if(db == null || simpleProcessList == null) return;

    let query = Query.Q().insertMstProcessQry;
    simpleProcessList.forEach((row)=> {
      let statement = db.prepare(query)
      statement.run(row.processName, row.createdTime)
    })
    try {
      if (statement.finalize()) {
        console.log("Execute insert to MST_PROCESS")
      } else {
        console.log("Failed to execute insert to MST_PROCESS")
      }
      } catch (error) {
        console.log("Error: {}", error.message)
      } finally {
        db.close();
        callback();
    }
  }

  function insertDetailProcessTbl(detailProcessList, callback) {
    let db = SQL.dbOpen();
    if(db == null || detailProcessList == null) return;

    //INSERT INTO PROCESS_LOG(ProcessId, BatchId, Handle, NPM, PM, WS, CPU, PID, SI, StartTime, LogTime)
    let query = Query.Q().insertProcessLogQry;
    detailProcessList.forEach((row)=> {
      let statement = db.prepare(query)
      statement.run(
        row.processId,
        row.batchId,
        row.handles,
        row.NPM,
        row.PM,
        row.WS,
        row.CPU,
        row.id,
        row.SI,
        row.starttime,
        new Date().toLocaleString()
      )
    })
    try {
      if (statement.finalize()) {
        console.log("Execute insert to PROCESS_LOG")
      } else {
        console.log("Failed to execute insert to PROCESS_LOG")
      }
      } catch (error) {
        console.log("Error: {}", error.message)
      } finally {
        db.close();
        callback();
      }
  }

  module.exports.insertDetailProcessTbl = function(detailProcessList, callback) {
    insertDetailProcessTbl(detailProcessList, callback);
  }

  module.exports.getLastBatchId = function(callback) {
    getLastBatchId(callback);
  }

  module.exports.insertCollectionBatchTbl = function(callback) {
    insertCollectionBatchTbl(callback)
  }

  module.exports.findAllProcess = function (callback) {
    findAllProcess(callback);
  }

  module.exports.insertSimpleProcessTbl = function(simpleProcessList, callback) {
    insertSimpleProcessTbl(simpleProcessList, callback);
  }

  //inputModel ekspetasinya sudah berbnetuk List ProcessModel
  module.exports.checkExistingProcessInTbl = function(inputModel, callback) {
    console.log(inputModel)
    let db = SQL.dbOpen();
    if(db == null) return;
    //Terima list process dalam bentuk ProcessModel
    //Cari process Id untuk tiap process, jika null maka kita harus buat 
    //Bangun list SimpleProcessModel
    //insert SimpleProcessModel
    //select SimpleProcessModel untuk dapat idnya
    //Bangun list ProcessModel
    //insert ProcessModel
    var allProcess = []
    findAllProcess((result)=> {
      allProcess = result;
      var simpleProcessModelList = [];
      inputModel.forEach((inputValue, inputIndex, inputArray) => {
        var processAlreadyListedInMst = false;
        for(let i=0; i<allProcess.length; i++) {
          if(allProcess[i].processName == inputValue.processName) {
            processAlreadyListedInMst = true;
            break;
          }
        }
        if(processAlreadyListedInMst ==  false) {
          //Membuat SimpleProcessModel
          simpleProcessModelList.push(
            pm.SimpleProcessModel({
              ProcessName: inputValue.processName,
              CreatedTime: new Date().toLocaleString(),
            })
          )
          allProcess.push(    
            pm.SimpleProcessModel({
              ProcessName: inputValue.processName,
              CreatedTime: new Date().toLocaleString(),
          })
          )
        }
      })
      callback(simpleProcessModelList, inputModel);

    })
    
    
  }