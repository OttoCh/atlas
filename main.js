const { app, BrowserWindow, ipcMain } = require('electron')
const readfile = require('./readfile.js');
const serviceCollector = require('./module/service/serviceCollector');
const processCollector = require('./module/process/processCollector');
const db = require('./module/db/dbInterface');
const processModel = require('./module/process/processModel');

function buttonclicked() {
    console.log("hello")
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if(BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})


ipcMain.on("btnclick", function(event, arg) {
    console.log("got it")
    var newWindow = new BrowserWindow({
        width: 450,
        height: 300,
        frame: true,
        show: false,
        webPreferences: {
            webSecurity: false,
            plugins: true,
            nodeIntegration: false
        }
    });

    newWindow.loadURL("secondpage.html");
    newWindow.show();

    event.sender.send("btnclick-task-finished", "yes");
});

ipcMain.on("testDB", function(event, arg) {
    console.log("start testing db")
    db.insertSimpleProcessTblExp(null, () => {
        console.log("done")
    })
    // db.initDb();
    // db.insertAllProcess
    // db.findAllProcess(placeholderCall);
    // db.findAllProcess(beginInsertSimpleProcess);
    // console.log(processModel.ProcessModel({
    //     handles: 1,
    //     NPM: 1,
    //     PM: 1,
    //     WS: 1,
    //     CPU: 1,
    //     id: 1,
    //     SI: 1,
    //     processName: 'yes'
    // }));
    //insert into PROCESS_LOG(PROCESSID, BATCHID, HANDLE, NPM, PM, WS, CPU, PID, SI, STARTTIME) VALUES(1,1,'1','1','1','1','1','1','1','2/2/2020 4:41:44 AM')
})


ipcMain.on("runservice", function(event, arg) {

    // readfile.openFile("./showService.ps1", (content)=> {
    //     console.log("finish reading " + content)
    //     runPowershell.executePSCommand(content, processPSResult)
    // })
    // runPowershell.executePSCommand("Get-Service", processServices)
    // runPowershell.executePSCommand("Get-Process", processProcess)

    // runPowershell.executePSFile('./GetAllProcesses.ps1', null, processAgain);    
    // serviceCollector.beginServiceCollector(randomCall);
    processCollector.beginProcessCollector(beginInsertSimpleProcess);
})

function beginInsertSimpleProcess(allSimpleProcessResult) {
    console.log(allSimpleProcessResult)
    console.log("Begin input process to database")
    db.checkExistingProcessInTbl(allSimpleProcessResult, (simpleProcessModelList, allProcessDetail)=> {
        //return adalah list process yang harus diinput ke MST_PROCESS dan list detail semua process dari PS
        db.insertSimpleProcessTbl(simpleProcessModelList, () => {
            var batchId = '';
            //insert new batch
            db.insertCollectionBatchTbl(()=> {
                db.getLastBatchId((lastId)=> {
                    batchId = lastId
                    //get the process id and give it to allProcessDetail
                    db.findAllProcess((allProcessMst) => {
                        allProcessMst.forEach((row_smp_process) => {
                            allProcessDetail.forEach((row_log_process, index) => {
                                if(row_log_process.processName == row_smp_process.processName) {
                                    allProcessDetail[index].processId = row_smp_process.id;
                                    allProcessDetail[index].batchId = batchId;
                                }
                            })
                        })
                        console.log("Begin inserting processing detail to DB")
                        //insert to log process
                        db.insertDetailProcessTbl(allProcessDetail, ()=> {
                            console.log("Finish collecting processing detail");
                        })
                    })
                })
            })
        })
    })
}

function inputProcessToDatabase(result) {
    console.log(result)

}


function placeholderCall() {
    console.log("done");
}

// function processPSResult(psresult) {
//     console.log("psresult: " + psresult);
//     let parameter = [
//         {GigaWatts: 1.0}
//     ];
//     runPowershell.executePSFile('./TestPower.ps1', parameter, processAgain)
// }


