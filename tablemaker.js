   //custom max min header filter
   var minMaxFilterEditor = function(cell, onRendered, success, cancel, editorParams){

    var end;

    var container = document.createElement("span");

    //create and style inputs
    var start = document.createElement("input");
    start.setAttribute("type", "number");
    start.setAttribute("placeholder", "Min");
    start.setAttribute("min", 0);
    start.setAttribute("max", 100);
    start.style.padding = "4px";
    start.style.width = "50%";
    start.style.boxSizing = "border-box";

    start.value = cell.getValue();

    function buildValues(){
        success({
            start:start.value,
            end:end.value,
        });
    }

    function keypress(e){
        if(e.keyCode == 13){
            buildValues();
        }

        if(e.keyCode == 27){
            cancel();
        }
    }

    end = start.cloneNode();
    end.setAttribute("placeholder", "Max");

    start.addEventListener("change", buildValues);
    start.addEventListener("blur", buildValues);
    start.addEventListener("keydown", keypress);

    end.addEventListener("change", buildValues);
    end.addEventListener("blur", buildValues);
    end.addEventListener("keydown", keypress);


    container.appendChild(start);
    container.appendChild(end);

    return container;
}
function minMaxFilterFunction(headerValue, rowValue, rowData, filterParams){
    //headerValue - the value of the header filter element
    //rowValue - the value of the column in this row
    //rowData - the data for the row being filtered
    //filterParams - params object passed to the headerFilterFuncParams property

        if(rowValue){
            if(headerValue.start != ""){
                if(headerValue.end != ""){
                    return rowValue >= headerValue.start && rowValue <= headerValue.end;
                }else{
                    return rowValue >= headerValue.start;
                }
            }else{
                if(headerValue.end != ""){
                    return rowValue <= headerValue.end;
                }
            }
        }

    return false; //must return a boolean, true if it passes the filter.
}
var homeButton = document.getElementById("scrape");
const scraper = require('./scrape');
const Tabulator = require('tabulator-tables');
const table = new Tabulator("#example-table", {
               //load row data from array
          layout:"fitColumns",      //fit columns to width of table
          responsiveLayout:"hide",  //hide columns that dont fit on the table
          tooltips:true,            //show tool tips on cells
          addRowPos:"top",          //when adding a new row, add it to the top of the table
          history:true,             //allow undo and redo actions on the table
          pagination:"local",       //paginate the data
          paginationSize:20,         //allow 7 rows per page of data
          movableColumns:true,      //allow column order to be changed
          resizableRows:true,       //allow row order to be changed
          initialSort:[             //set the initial sort order of the data
            {column:"Date", dir:"asc"},
          ],
          columns:[                 //define the table columns
            {title:"Name", field:"Name",width:170,headerFilter:"input"},
            {title:"Description", field:"Description", align:"left",headerFilter:"input"},
            {title:"Link", field:"Link", width:300, editor:true,headerFilter:"input"},
            {title:"Upvotes", field:"Upvotes", width:100, editor:"input",headerFilter:minMaxFilterEditor, headerFilterFunc:minMaxFilterFunction},
            {title:"Date", field:"Date", width:130, align:"center",headerFilter:"input"},
          ],
        });
homeButton.onclick = function(){
    let data = new Promise((resolve,reject)=>{
        let start = new Date(document.getElementById('start').value);
        let end = new Date(document.getElementById('end').value);
        console.log(start);
        let res = scraper.getData(start,end);
        resolve(res);
    });
    data.then((val)=>{
      table.setData(val)
      let lbl = document.getElementById('upload-label');
      lbl.textContent = 'Data scraped and saved.'
    });
} 
//trigger download of data.csv file
function download_csv(){
    table.download("csv", "data.csv");
}

let upload = document.getElementById('upload');
upload.addEventListener('click',(event)=>{
    let lbl = document.getElementById('upload-label');
    var txt = lbl.textContent;
    if(txt!='No file has been chosen.' && txt.length>0 && txt!=null){
        const csv = require('csv-parser');
        const fs = require('fs');
        let uploaded_data = [];
        fs.createReadStream(txt)
        .pipe(csv())
        .on('data', function(data){
            try {
                uploaded_data.push(data);
            }
            catch(err) {
                lbl.textContent='error'
            }
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            table.setData(uploaded_data);
            let progress = document.getElementById('progressbar');
            let val = 100;
            progress.textContent = val;
            progress.style='width:'+val+'%';
        });
    
    }

})
