const {ipcRenderer} = require('electron');
let upButton = document.getElementById('choose-file');
upButton.addEventListener('click',(event)=>{
    ipcRenderer.send('open-file-dialog-for-file');
});
ipcRenderer.on('selected-file',(event,path)=>{
    if(path==null){
        document.getElementById('upload-label').textContent = 'No file has been chosen.';
    }else{ 
        document.getElementById('upload-label').textContent = path;
    }
    let lbl = document.getElementById('upload-label');
    
    if(lbl.textContent.length>0){
        let btn = document.getElementById('upload');
        btn.className = document.getElementById('upload').className.replace(' disabled','');
        btn.disabled = false;
    
    }
});