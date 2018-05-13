const electron = require('electron');


const {Notification} = electron;

var a = new Notification([{title: 'Text Rendered!', body: 'hi'}]).show();