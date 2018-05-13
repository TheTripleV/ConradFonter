const electron = require('electron');
const url = require('url');
const path = require('path');
const Jimp = require("jimp");
const mergeImg = require('merge-img');
const { app, BrowserWindow, Menu, ipcMain, Notification } = electron;

//require('electron-debug')({showDevTools: true});

/* var image = new Jimp(256, 256, 0xFF0000FF, function (err, image) {
    // this image is 256 x 256, every pixel is set to 0xFF0000FF
}); */



let mainWindow;




//Listen for app to be ready
app.on('ready', function () {
    //image.write(app.getPath('desktop') + '/test1.png');
    /* Jimp.read(path.join(__dirname,"letters/Y.png"), function (err, Y) {
        if (err) throw err;
        Y.write(app.getPath('desktop') + '/test2.png'); // save
    }); */


    mainWindow = new BrowserWindow({icon: path.join(__dirname, 'assets/icons/png/64x64.png')});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

mainWindow.on('close', function(event){
    app.quit();
});

ipcMain.on('items', function (e, item) {
    //image.write(app.getPath('desktop') + '/test2.png');
    
    var downloadLocation = item[1];
    var text = item[0];
    var imgh = parseInt(item[2],10);
    var paramsArr = [];

    for (let ch of text) {
        paramsArr.push(path.join(__dirname, "letters", ch + ".png"));
    }
    console.log(item);

    mergeImg(paramsArr)
        .then((img) => {
            // Save image as file
            img.resize(Jimp.AUTO, imgh).write(
                app.getPath(downloadLocation) + '/' + text + '.png', () => {
                    mainWindow.webContents.send('done' , {msg:'done'});
                    new Notification({ title: 'Text Rendered!', body: '"'+text+'"' + ' has rendered succesfully and has been downloaded to your ' + downloadLocation + ' folder.' }).show()
                });
        });
});

// menu template

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

//if mac - add empty object to menu

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}